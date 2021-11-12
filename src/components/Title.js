import React from 'react'
import { View, Text } from 'react-native'

const Title = ({name}) => {
    return (
        <View>
            {name ? <Text>Welcome {name}!</Text> : <Text>Welcome user! You can fill your data in settings section</Text>}
        </View>
    )
}

export default Title;
