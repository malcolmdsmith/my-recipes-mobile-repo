import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Screen from "../components/Screen";
import Button from "../components/Button";


class ErrorView extends Component {
    // This component will be displayed when an error boundary catches an error
    render() {
        const dimensions = Dimensions.get('window');
        const imageHeight = Math.round((dimensions.width-100) * 3 / 4);
        const imageWidth = dimensions.width-100;

        return (
            <View  style={styles.container}>
                <View>
                    <Image style={{width:imageWidth, height:imageHeight, marginTop:10, borderRadius:20}} source={require('../assets/errorScreen.jpg')} />
                </View>
                <View>
                    <Image style={{width:150, height:150}} source={require('../assets/oops.png')} />
                </View>
                <Text style={{textAlign:'center'}}>Sorry but the operation could not be completed! Make sure you are connected to the internet!</Text>
                <View style={styles.button}>
                    <Button title="Continue" onPress={() => this.props.onContinue()} />
                </View>
            </View>
        )
    }
  }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center'
        },
        button: {
            width: '100%'
        }
    });

  export default ErrorView;