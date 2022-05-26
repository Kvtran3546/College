/*
Khoa Tran
CS 392 Hw 5
I pledge my honor that i have abided by the Stevens honor system.
*/
#include <fcntl.h>
#include <stdbool.h>
#include <signal.h>
#include <pwd.h>
#include <wait.h>
#include <setjmp.h>
#include <dirent.h>
#include <limits.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <stdio.h>

#define BLUE "\x1b[34;1m"
#define DEFAULT "\x1b[0m"
#define RED "\x1b[31m"

volatile sig_atomic_t interrupted = true;
volatile sig_atomic_t is_child = false;

sigjmp_buf jmpbuf;

char cwd[PATH_MAX];
char *args[2048];
void catch_signal(int signal){
    if(!is_child){
        write(1, "\n", 1);
    }
    siglongjmp(jmpbuf, 1);
}

void cd_helper(char* directory){
    struct passwd *p;
    char *temp = "~/";
    bool check = true; //check if directory getting to starts with home directory
    if(strlen(temp) > strlen(directory)){
        check = false;
    }
    if(strncmp(directory,temp, 2) != 0){
        check = false;
    }
    if(check){ //directory starts with "~/" 
        if((p = getpwuid(getuid()))==NULL){
            fprintf(stderr, "%sError: Cannot get passwd entry. %s.%s\n", RED, strerror(errno), DEFAULT);
        }
        char *home = p->pw_dir;
        directory = directory + 1; //skips over the ~
        char *new_dir;
        if((new_dir = (char*)calloc(1,1 + (strlen(home) + strlen(directory)) * 1)) == NULL){
            fprintf(stderr, "%sError: malloc() failed. %s.%s\n", RED, strerror(errno), DEFAULT);
        }
        strcpy(new_dir, home);
        strcat(new_dir, directory);
        if(chdir(new_dir) == -1){
            fprintf(stderr, "%sError: Cannot change directory to '%s'. %s. %s\n", RED, directory, strerror(errno), DEFAULT);
        }
        free(new_dir);
    }else if((strcmp(directory,"") == 0)||(strcmp(directory,"~") == 0)){ //go to home directory
        if((p = getpwuid(getuid()))==NULL){
            fprintf(stderr, "%sError: Cannot get passwd entry. %s.%s\n", RED, strerror(errno), DEFAULT);
        }
        char *home = p->pw_dir;
        if(chdir(home)==-1){
            fprintf(stderr, "%sError: Cannot change directory to '%s'. %s. %s\n", RED, directory, strerror(errno), DEFAULT);
        }
    }else{
        if(chdir(directory)==-1){
            fprintf(stderr, "%sError: Cannot change directory to '%s'. %s. %s\n", RED, directory, strerror(errno), DEFAULT);
        }
    }
}

int main(){
    struct sigaction action;
    memset(&action, 0 , sizeof(struct sigaction));
    action.sa_handler = catch_signal;
    action.sa_flags = SA_RESTART;
    if((sigaction(SIGTERM, &action,NULL) == -1)||(sigaction(SIGINT, &action, NULL) == -1)){ //catch sigint and sigterm
        fprintf(stderr, "%sERROR: Cannot register signal handler. %s.%s\n", RED, strerror(errno), DEFAULT);
        return EXIT_FAILURE;
    }
    sigsetjmp(jmpbuf,1);
    while(1){
        if(getcwd(cwd, sizeof(cwd)) == NULL) {
            fprintf(stderr,"%sERROR: Cannot get current working directory. %s.%s\n", RED, strerror(errno), DEFAULT);
            return EXIT_FAILURE;
        }
        printf("%s[%s]%s>", BLUE, cwd, DEFAULT); //prints the cwd
        fflush(stdout);
        char buf[4096];
        ssize_t b_read;
        if((b_read = read(0, buf, sizeof(buf)-1)) < 0){ //read in arguments
            return EXIT_FAILURE;
        }else if(b_read > 0){
            buf[b_read-1] = '\0';
        }
        if(b_read == 1){
            continue;
        }
        char *token = strtok(buf, " ");
        int num = 0;        
        while(token != NULL){ //store arguments in a double array
            args[num] = strdup(token);
            token = strtok(NULL, " ");
            num++;
        }
        if(strcmp("cd", args[0]) == 0){  //check if argument is change directory
            if(num >= 3){ //if there are too many arguments
                fprintf(stderr, "%sError: Too many arguments to cd.\n%s", RED, DEFAULT);
            }else if(num == 2){
                cd_helper(args[1]);
            }else if(num == 1){
                cd_helper("~");
            }
        }else if(strcmp("exit", args[0]) == 0){ //check if argument is exit
            for(int i = 0; i < num; i++){
                free(args[i]);
            }
            return EXIT_SUCCESS;
        }else if(num > 0){  //check if argument needs to be executed
            args[num] = NULL;
            pid_t pid;
            if((pid = fork())<0){ //fork does not work
                fprintf(stderr, "%sError: fork() failed. %s. %s\n", RED, strerror(errno), DEFAULT);
                for(int i = 0; i < num; i++){
                    free(args[i]);
                }
                return EXIT_FAILURE;
            }else if(pid > 0){ //this is parent
                int stat;
                is_child = true;
                if((waitpid(pid, &stat,0)) < 0){
                    fprintf(stderr, "%sError: wait() failed. %s. %s\n", RED, strerror(errno), DEFAULT);
                    for(int i = 0; i < num; i++){
                        free(args[i]);
                    }
                    return EXIT_FAILURE;
                }
                is_child = false;
            }else{          //this is child
                if(execvp(args[0], args) == -1){
                    fprintf(stderr, "%sError: exec() failed. %s. %s\n", RED, strerror(errno), DEFAULT);
                    return EXIT_FAILURE;
                }
                for(int i = 0; i < num; i++){
                    free(args[i]);
                }
                return EXIT_FAILURE;
            }
        }
        for(int i = 0; i < num; i++){ //free the array
            free(args[i]);
        }
    }
    return EXIT_SUCCESS;
}