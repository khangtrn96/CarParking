import React, { Component } from 'react'
import { Text, StyleSheet, View, AppRegistry } from 'react-native'

export default class Map extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text> textInComponent </Text>
                <Text> textInComponent </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})

