import React from 'react';
import {
	StyleSheet, Text, View ,StatusBar, TextInput,Dimensions,Platform, ScrollView, AsyncStorage
} from 'react-native';
import {AppLoading} from "expo";
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";


const {height, width} = Dimensions.get("window");
export default class App extends React.Component {
	state={
		newTodo:"",
		loadedToDos:false,
		toDos:{}
	};
	componentDidMount = () =>{
		this._loadToDos();
	}
	render() {
		const {newTodo, loadedToDos , toDos} = this.state;
		if(!loadedToDos) return <AppLoading/>;
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content"/>
				<Text style={styles.title}>Kawai Todo</Text>
				<View style={styles.card}>
					<TextInput
						style={styles.input}
						placeholder={"New To do"}
						placeholderTextColor={"#999"}
						value={newTodo}
						onChangeText={this._controllNewTodo}
						returnKeyType={"done"}
						autoCorrect={false}
						onSubmitEditing={this._addToDo}
					/>
					<ScrollView contentContainerStyle={styles.toDos}>
						{Object.values(toDos).reverse()
							.map(toDo => (
							<ToDo
								key={toDo.id}
								{...toDo}
								deleteToDo ={this._deleteToDo}
								completeTodo ={this._completeToDo}
								uncompleteTodo={this._uncompleteToDo}
								updateTodo = {this._updateToDo}
							/>
						))}
					</ScrollView>
				</View>
			</View>
		);
	}
	_controllNewTodo=text => {
		this.setState({
			newTodo:text
		})
	};
	_loadToDos =  async () => {
		try{
			const toDos=await AsyncStorage.getItem("toDos");
			const parsedToDos = JSON.parse(toDos);
			console.log(toDos);
			this.setState({
				loadedToDos:true,
				toDos : parsedToDos || {}
			})
		}catch(err){
			console.log(err);
		}

	};
	_addToDo = () => {
		const {newTodo} = this.state;
		if(newTodo!==""){
			this.setState(prevState=>{
				const ID= uuidv1();
				const newToDoObject={
					[ID]:{
						id:ID,
						isCompleted:false,
						text:newTodo,
						createdAt:Date.now()
					}
				}
				const newState = {
					...prevState,
					newTodo:"",
					toDos:{
						...prevState.toDos,
						...newToDoObject
					}
				};
				this._saveToDos(newState.toDos);
				return {...newState};
			});
		}
	}
	_deleteToDo=(id)=>{
		this.setState(prevState=>{
			const toDos=prevState.toDos;
			delete toDos[id];
			const newState = {
				...prevState,
				...toDos
			}
			this._saveToDos(newState.toDos);
			return {...newState};
		})
	}
	_uncompleteToDo = (id) => {
		this.setState(prevState => {
			const newState={
				...prevState,
				toDos:{
					...prevState.toDos,
					[id] : {
						...prevState.toDos[id],
						isCompleted:false
					}
				}
			}
			this._saveToDos(newState.toDos);
			return {...newState};
		});
	}
	_completeToDo = (id) => {
		this.setState(prevState => {
			const newState={
				...prevState,
				toDos:{
					...prevState.toDos,
					[id] : {
						...prevState.toDos[id],
						isCompleted:true
					}
				}
			}
			this._saveToDos(newState.toDos);
			return {...newState};
		});
	}
	_updateToDo = (id, text)=>{
		this.setState(prevState => {
			const newState={
				...prevState,
				toDos:{
					...prevState.toDos,
					[id] : {
						...prevState.toDos[id],
						text:text
					}
				}
			}
			this._saveToDos(newState.toDos);
			return {...newState};
		});
	}
	_saveToDos=(newToDos) => {
		console.log(newToDos);
		const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F23657',
		alignItems: 'center'
	},
	title:{
		color:"white",
		fontSize:30,
		marginTop:50,
		fontWeight:"300",
		marginBottom:30
	},
	card:{
		backgroundColor:"white",
		flex:1,
		width:width-25,
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		...Platform.select({
			ios:{
				shadowColor:"rgb(50,50,50)",
				shadowOpacity:0.5,
				shadowRadius:5,
				shadowOffset:{
					height:-1,
					width:0
				}
			},
			android:{
				elevation:3
			}
		})
	},
	input:{
		padding:20,
		borderBottomColor:"#bbb",
		borderBottomWidth:1,
		fontSize:25
	},
	toDos:{
		alignItems:"center"
	}
});
