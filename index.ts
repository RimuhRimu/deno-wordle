//This is a terminal based game to play wordle using pokemon's name
import { bgBrightBlack, bgGreen, bgYellow, black, bold } from 'colors'
const MAX_TRIES = 6
//allows you to see the name of the pokemon
const ARCEUS_MODE = !!Deno.env.get('ARCEUS_MODE')

//fetch the pk
const pokemon = await fetch(
	`https://pokeapi.co/api/v2/pokemon/${Math.ceil(Math.random() * 800)}`,
)
	.then((res) => res.json())
	.then((json) => json.name.toUpperCase())
if (ARCEUS_MODE) console.log(pokemon)

/**
 * checkPropmt.
 *
 * @param {string} msg
 * @param {string} reference
 * @returns {string}
 */
function checkPropmt(msg: string, reference: string): string {
	let result = ''
	for (let i = 0; i < msg.length; i++) {
		if (msg[i] === reference[i]) {
			result += writeColorMessg(`${msg[i]} `, 'correct')
		} else if (
			reference.slice(0, i).includes(msg[i]) && msg[i] !== reference[i]
		) result += writeColorMessg(`${msg[i]} `, 'includes')
		else result += writeColorMessg(`${msg[i]} `, 'wrong')
	}
	return result
}

/**
 * splitPKname.
 *
 * @param {string} pk
 * @returns {string}
 */
function splitPKname(pk: string): string {
	let result = ''
	for (const char of pk) {
		result += `${char} `
	}
	return result
}

/**
 * writeColorMessg.
 *
 * @param {string} message
 * @param {'wrong' | 'correct' | 'includes'} type
 * @returns {string}
 */
function writeColorMessg(
	message: string,
	type: 'wrong' | 'correct' | 'includes',
): string {
	const styles = {
		wrong: (messg: string): string => bgBrightBlack(bold(black(messg))),
		correct: (messg: string): string => bgGreen(bold(black(messg))),
		includes: (messg: string): string => bgYellow(bold(black(messg))),
	}
	return styles[type](message)
}

/**
 * game.
 *
 * Starts the game
 *
 * @returns {void}
 */
function game(): void {
	const record: string[] = []
	let [guessed, i] = [false, 0]
	while (!guessed && i < MAX_TRIES) {
		console.log(`The pokemon has ${pokemon.length} characters!`)
		const message = prompt('Say the pokemon!: ')
		if (!message) console.log('You must provide a pokemon!')
		else if (!/^[a-zA-Z]+$/.test(message)) {
			console.log('You must provide only letters!')
		} else if (message?.length !== pokemon.length) {
			console.log(
				`write enough characters, The pokemon has ${pokemon.length} characters!`,
			)
		} else if (message.toUpperCase() === pokemon) {
			guessed = !guessed
			record.push(
				writeColorMessg(splitPKname(message.toUpperCase()), 'correct'),
			)
			for (const s of record) console.log(s)
			break
		} else if (MAX_TRIES === i + 1) {
			console.log(`The correct pokemon was ${pokemon}`)
			break
		} else {
			record.push(
				checkPropmt(message.toUpperCase(), pokemon),
			)
			for (const s of record) console.log(s)
			i++
		}
		console.log(`You have ${MAX_TRIES - i} tries left`)
	}
}

game()
