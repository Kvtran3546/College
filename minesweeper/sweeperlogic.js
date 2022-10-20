//logic of sweeper
export const TILE_STAT = {
	HIDDEN: 'hidden',
	MINE: 'mine',
	NUMBER: 'number',
	MARKED: 'marked',
}

export function createBoard(boardSize, numberOfMines){
	const board = []
	const minePositions = getMinePositions(boardSize, numberOfMines)
	console.log(minePositions)
	for(let x = 0; x < boardSize; x++){
		const row = []
		for(let y = 0; y < boardSize; y++){
			const element = document.createElement("div")
			element.dataset.status = TILE_STAT.HIDDEN
			const tile = {element, x, y,
				mine: minePositions.some(p => positionMatch(p, {x,y})),
				get status(){
					return this.element.dataset.status
				},
				set status(value){
					this.element.dataset.status = value
				}
			}
			row.push(tile)
		}
		board.push(row)
	}
	return board
}

function getMinePositions(boardSize, numberOfMines){
	const positions = []
	while(positions.length < numberOfMines){
		const position = {
			x: randomNumber(boardSize),
			y: randomNumber(boardSize)
		}
		if(!positions.some(p => positionMatch(p, position))) {
			positions.push(position);
		}
	}
	return positions;
}

function positionMatch(a,b){
	return a.x == b.x && a.y == b.y
}

function randomNumber(size){
	return Math.floor(Math.random() * size);
}

export function markTile(tile){
	if(tile.status !== TILE_STAT.HIDDEN && TILE_STAT.MARKED !== tile.status){
		return
	}
	if(tile.status == TILE_STAT.NUMBER){
		return
	}
	if(tile.status == TILE_STAT.MARKED){
		tile.status = TILE_STAT.HIDDEN
		return 1
	}else {
		tile.status = TILE_STAT.MARKED
		return 0
	}
}

export function revealTile(board, tile){
	if(tile.status !== TILE_STAT.HIDDEN){
		return
	} else if (tile.mine){
		tile.status = TILE_STAT.MINE
		return
	}
	tile.status = TILE_STAT.NUMBER
	const tiles = nearbyTiles(board, tile)
	var num;
	const mines = tiles.filter(t => t.mine)
	if(mines.length == 0){
		tiles.forEach(revealTile.bind(null, board))
	}else{
		tile.element.textContent = mines.length
	}
}

function nearbyTiles(board, tile){
	const tiles = []
	for(let x = -1; x <= 1; x++){
		for(let y = -1; y <= 1; y++){
			const temp_tile = board[tile.x + x]?.[tile.y + y]
			if(temp_tile){
				tiles.push(temp_tile)
			}
		}
	}
	return tiles
}

export function checkWon(board, boardSize){
	const tiles = []
	for(let x = 0; x < boardSize; x++){
		for(let y = 0; y < boardSize; y++){
			const temp_tile = board[x][y]
			if(temp_tile.status == TILE_STAT.HIDDEN || temp_tile.status == TILE_STAT.MARKED){
				tiles.push(temp_tile)	
			}
		}
	}
	console.log(tiles)
	if(tiles.length !== 10){
		return false
	}
	const mines = tiles.filter(t => t.mine)
	if(mines.length == 10){
		return true
	}
	return true
}

export function checkLost(board, boardSize){
	for(let x = 0; x < boardSize; x++){
		for(let y = 0; y < boardSize; y++){
			const temp_tile = board[x][y]
			if(temp_tile.status == TILE_STAT.MINE){
				return true
			}
		}
	}
	return false
}