import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

const TransactionItem = ({ key, id, name, amount, currency, transactionType, updateFn}) => {
    
    const deleteTransaction = ( id ) => {
        firestore().collection('transactions').doc(id).delete().then(console.log('Transaction', id, 'deleted')).then(updateFn);
    }
    
    return (
        <View style={styles.itemWrapper} key={key}>
            <View style={{ flex: 5 }}>
                <Text style={styles.itemText}>{name}</Text>
            </View>
            <View style={{ flex: 3 }}>
                {
                    (transactionType == "incoming") ? <Text style={styles.itemText}>+ {amount} {currency}</Text> : <Text style={styles.itemText}>- {amount} {currency}</Text>
                }
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => deleteTransaction(id)}>
                    <Icon name="delete" size={25} color="white"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemWrapper: {
        flex: 1,
        padding: 10,
        margin: 5,
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: '#87BFFF',
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
    },
    itemText: {
        fontSize: 17,
        paddingRight: 25,
        paddingLeft: 25
    }
})

export default TransactionItem;
