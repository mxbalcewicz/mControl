import React from 'react';
import { View, Text } from 'react-native';

const TransactionItem = ({id, name, amount}) => {
    return (
        <View style={styles.itemWrapper}>
            <View>
                <Text>{name}</Text>
            </View>
            <View>
                <Text>{amount}</Text>
            </View>
        </View>
    )
}

export default TransactionItem;
