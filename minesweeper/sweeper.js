// populate board with tiles and mines

import { createBoard, 
	markTile, 
	revealTile, 
	checkWon,
	checkLost,
	TILE_STAT} from './sweeperlogic.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10
const minesleft = document.querySelector('[data-mine-count]')
const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')

const endText = document.querySelector('.subtext')

console.log(board)
board.forEach(row => {
	row.forEach(tile => {
		boardElement.append(tile.element)
		tile.element.addEventListener('click', () => {
			revealTile(board, tile)
			checkGame()
		})
		tile.element.addEventListener('contextmenu', e => {
			e.preventDefault()
			const num = markTile(tile)
			if(num == 0){
				minesleft.textContent--
			}else if (num == 1){
				minesleft.textContent++
			}
			if(minesleft.textContent == 0){
				checkGame()
			}
		})
	})
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesleft.textContent = NUMBER_OF_MINES

function checkGame(){
	const win = checkWon(board, BOARD_SIZE)
	const lose = checkLost(board, BOARD_SIZE)
	console.log(win)
	if(win|| lose){
		boardElement.addEventListener('click', stopProp, { capture: true})
		boardElement.addEventListener('contextmenu', stopProp, { capture: true})
	}
	if(win){
		endText.textContent = "'YOU WON!'"
	}
	if(lose){
		endText.textContent = "'YOU LOST!'"
		board.forEach(row =>{
			row.forEach(tile =>{
				if(tile.mine){tile.status = TILE_STAT.MINE}
			})
		})
	}
}

function stopProp(e){
	e.stopImmediatePropagation()
}
// left click on tiles
	//reveal tiles


// right click on tiles
	//mark tiles //done


// check for win/lose
