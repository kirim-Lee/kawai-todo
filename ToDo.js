import React, {Component} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from "react-native";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get("window");
export default class ToDo extends Component{
	constructor(props){
		super(props);
		this.state = {isEditing :false, toDoValue:props.text}
	}
	static propTypes = {
		text:PropTypes.string.isRequired,
		isCompleted:PropTypes.bool.isRequired,
		deleteToDo:PropTypes.func.isRequired,
		id:PropTypes.string.isRequired,
		uncompleteTodo :PropTypes.func.isRequired,
		completeTodo :PropTypes.func.isRequired,
		updateTodo:PropTypes.func.isRequired
	};
	render(){
		const {isEditing, toDoValue} = this.state;
		const {text, id, deleteToDo, isCompleted} = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.column}>
					<TouchableOpacity onPress={this._toggleComplete}>
						<View style={[styles.circle, isCompleted? styles.completedCircle : styles.uncompletedCircle]} />
					</TouchableOpacity>
					{isEditing?
						<TextInput
							style={[styles.text, styles.input, isCompleted? styles.completedText : styles.uncompletedText]}
							value={toDoValue}
							multiline={true}
							onChangeText={this._controllInput}
							returnKeyType={"done"}
							onBlur={this._finishEditing}
						/>
						:
						<Text style={[styles.text, isCompleted? styles.completedText : styles.uncompletedText ]}>{text}</Text>
					}

				</View>
				<View style={styles.cloumn}>
					{isEditing ?
						<View style={styles.actions}>
							<TouchableOpacity onPressOut={this._finishEditing}>
								<View style={styles.actionsContainer}>
									<Text style={styles.actionText}>✅</Text>
								</View>
							</TouchableOpacity>
						</View>
					 :
						<View style={styles.actions}>
							<TouchableOpacity onPressOut={this._startEditing}>
								<View style={styles.actionsContainer}>
									<Text style={styles.actionText}>✏</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPressOut = {(event) => {
								event.stopPropagation();
								deleteToDo(id);
							}}>
								<View style={styles.actionsContainer}>
									<Text style={styles.actionText}>❌</Text>
								</View>
							</TouchableOpacity>
						</View>
					}
				</View>
			</View>
		);
	}
	_toggleComplete = (event) =>{
		event.stopPropagation();
		const {isCompleted, completeTodo, uncompleteTodo, id} = this.props;
		if(!isCompleted) completeTodo(id);
		else uncompleteTodo(id);
	};
	_startEditing=(event) => {
		event.stopPropagation();
		const {text} = this.props;
		this.setState({
			isEditing:true,
			toDoValue:text
		})
	};
	_finishEditing = (event) => {
		event.stopPropagation();
		const {toDoValue} = this.state;
		const {id, updateTodo} = this.props;
		updateTodo(id,toDoValue);
		this.setState({
			isEditing:false
		})

	};
	_controllInput = (text) => {
		this.setState({
			toDoValue:text
		})
	}
}

const styles= StyleSheet.create({
	container : {
		width: width -50,
		borderBottomColor:"#bbb",
		borderBottomWidth:StyleSheet.hairlineWidth,
		flexDirection:"row",
		alignItems:"center",
		justifyContent:"space-between"
	},
	text:{
		fontWeight:"500",
		fontSize:20,
		marginVertical:20
	},
	circle:{
		width:30,
		height:30,
		borderRadius:15,
		marginRight:20,
		borderWidth:3
	},
	completedCircle:{
		borderColor:"#bbb"
	},
	uncompletedCircle:{
		borderColor:"red"
	},
	completedText:{
		color:"#bbb",
		textDecorationLine:"line-through"
	},
	uncompletedText:{
		color:"black"
	},
	column:{
		flexDirection:"row",
		alignItems:"center",
		width:width/2
	},
	actions:{
		flexDirection:"row"
	},
	actionsContainer:{
		marginVertical:10,
		marginHorizontal:10
	},
	input:{
		marginVertical:20,
		width:width/2
	}
});