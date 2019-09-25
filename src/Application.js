import React, { Component } from "react";
import { database } from "./firebase";
import "./Application.css";
import uniqueId from "lodash/uniqueId";

class App extends Component {
	constructor(props) {
		super(props);
		this.usersRef = null;
		this.userRef = null;
		this.state = {
			numberOfPlayers: 5,
			character: "",
			user: null,
			users: {},
			player: "",
			avalon: {},
			inGame: true,
			playersSet: 0,
			characters: [
				{ name: "Selecciona tu personaje", value: 0 },
				{ name: "MERLIN", value: 1 },
				{ name: "PERCIVAL", value: 2 },
				{ name: "INUTIL BUENO", value: 3 },
				{ name: "ASESINA", value: 4 },
				{ name: "MORGANA", value: 5 },
				{ name: "MORDRED", value: 6 },
				{ name: "INUTIL MALO", value: 7 },
				{ name: "LANCELOT", value: 8 },
				{ name: "LANCELOTA", value: 9 },
				{ name: "OBERON", value: 10 }
			],
			numbers: [5, 6, 7, 8, 9, 10],
			allSubmmitted: false,
			didSelect: false,
			playerChosen: false
		};
	}

	componentDidMount() {
		// database.ref("/inGame")
		// .on("value")
		// .then(function(snapshot) {
		// 	var username =
		// 		(snapshot.val() && snapshot.val().username) || "Anonymous";
		// 	// ...
		// });
		// database.ref().on("value", snapshot => {
		// 	this.setState({
		// 		avalon: snapshot.val()
		// 	});
		// });

		database.ref("/inGame").on("value", snapshot => {
			this.setState({
				inGame: snapshot.val()
			});
		});

		database.ref("/numberOfPlayers").on("value", snapshot => {
			this.setState({
				numberOfPlayers: snapshot.val()
			});
		});
		this.setState({
			playerChosen: sessionStorage.getItem("selected")
		});
	}

	handleSelectChange = e => {
		this.setState({ character: e.target.value });
	};

	handlePlayerTotalSelectChange = e => {
		const numberOfPlayers = parseInt(e.target.value);
		this.setState({ numberOfPlayers });
	};

	handleSubmit = event => {
		event.preventDefault();
		document.getElementById("main-container").style.display = "none";
		document.getElementById("player-container").style.display = "block";

		let playerInfo = {
			playerName: this.state.player,
			character: this.state.character,
			didSelect: !this.state.didSelect,
			playerId: parseInt(uniqueId())
		};

		database
			.ref()
			.child(this.state.player)
			.set(playerInfo);

		sessionStorage.setItem("selected", true);
	};

	handleNewGame = event => {
		event.preventDefault();
		// document.getElementById("main-container").style.display = "none";
		// document.getElementById("player-container").style.display = "block";

		// let playerInfo = {
		// 	playerName: this.state.player,
		// 	character: this.state.character
		// };
		this.setState({
			inGame: true,
			numberOfPlayers: this.state.numberOfPlayers
		});
		let inGame = true;
		let numberOfPlayers = parseInt(this.state.numberOfPlayers);

		database
			.ref()
			.child("inGame")
			.set(inGame);

		database
			.ref()
			.child("numberOfPlayers")
			.set(numberOfPlayers);
	};

	handlePlayerChange = event => {
		const player = event.target.value;
		this.setState({ player });
	};

	render() {
		const {
			user,
			users,
			inGame,
			numbers,
			numberOfPlayers,
			allSubmmitted
		} = this.state;

		return (
			<div className="App">
				{!inGame && (
					<div className="newgame">
						<h3>Cantida de jugadores:</h3>
						<select
							className="dropdown"
							onChange={this.handlePlayerTotalSelectChange}
							value={numberOfPlayers}
						>
							{numbers.map(number => (
								<option key={number} value={number}>
									{number}
								</option>
							))}
						</select>
						<button disabled={inGame} onClick={this.handleNewGame}>
							NUEVA RONDA
						</button>
					</div>
				)}

				{inGame && (
					<div>
						<header className="App--header">
							<h1>Avalon 2.0</h1>
						</header>
						<div className="ui form" id="main-container">
							<div className="field">
								<label>Tu Nombre</label>
								<div className="ui grid">
									<div className="sixteen wide column">
										<input
											id="playerName"
											type="text"
											value={this.state.player}
											onChange={this.handlePlayerChange}
										/>
									</div>
								</div>
							</div>
							<div className="field">
								<label>Personaje</label>
								<select
									className="dropdown notranslate"
									onChange={this.handleSelectChange}
									value={this.state.character}
								>
									{this.state.characters.map(character => (
										<option key={character.value} value={character.name}>
											{character.name}
										</option>
									))}
								</select>
							</div>

							<div className="ui bottom">
								<button
									className="large ui primary blue button fluid"
									id="boton"
									onClick={this.handleSubmit}
									disabled={this.state.buttonDisabled}
								>
									Enviar
								</button>
							</div>
							{/* {JSON.stringify(this.state.avalon, null, 2)} */}
						</div>

						<AvalonPlayer
							avalon={this.state.avalon}
							player={this.state.player}
							character={this.state.character}
						/>
					</div>
				)}
			</div>
		);
	}
}

class AvalonPlayer extends React.Component {
	componentDidMount() {
		document.getElementById("player-container").style.display = "none";
	}

	handleClose = () => {
		window.location.reload();
	};

	render() {
		const player = this.props.player;
		const character = this.props.character;
		const avalon = this.props.avalon;
		const allies = [];
		// for (var characterName in avalon) {
		// 	console.log(avalon[characterName].character);
		// }
		let message =
			"Lamentablemente no tenes informacion de entrada en el juego. Pendiente de todos!";

		if (character === "MERLIN") {
			message = "Los siguientes jugadores estan irradiando una aura malvada:";
			for (let characterName in avalon) {
				if (avalon[characterName].character === "MORGANA") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "ASSASIN") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "OBERON") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "EVIL MINION") {
					allies.push(avalon[characterName].playerName);
				}
			}
		}

		if (
			character === "MORGANA" ||
			character === "ASSASIN" ||
			character === "EVIL MINION" ||
			character === "MORDRED"
		) {
			for (let characterName in avalon) {
				if (avalon[characterName].character === "ASSASIN") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "MORDRED") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "EVIL MINION") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "MORGANA") {
					allies.push(avalon[characterName].playerName);
				}
			}
			message = "Tu gente malvada es:";
		}

		if (character === "PERCIVAL") {
			for (var characterName in avalon) {
				if (avalon[characterName].character === "MORGANA") {
					allies.push(avalon[characterName].playerName);
				}
				if (avalon[characterName].character === "MERLIN") {
					allies.push(avalon[characterName].playerName);
				}
			}
			message = "Uno de estos puede ser Merlin:";
		}

		const showAllies = allies.map(ally => {
			return <li>{ally}</li>;
		});

		return (
			<div className="ui centered card hidden" id="player-container">
				<div className="content">
					<h3>Hola, {player}</h3>
					<p>{message}</p>
					{showAllies}

					{/* <div className="ui bottom">
						<button
							id="boton"
							className="large ui primary blue button fluid"
							onClick={this.handleClose}
						>
							Cerrar
						</button>
					</div> */}
				</div>
			</div>
		);
	}
}

export default App;
