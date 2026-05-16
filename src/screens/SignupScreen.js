import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
    const [input, setInput] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigation = useNavigation();

    // Use standard local IP or production URL. Replace with actual if needed.
    const url = 'http://10.0.2.2:5000'; 

    useEffect(() => {
        if (user) {
            // Already handled by AppNavigator logically
        }
    }, [user]);

    const signupHandler = async () => {
        if (!input.username || !input.email || !input.password) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${url}/api/v1/user/register`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            
            if (res.data.success) {
                Alert.alert('Success', res.data.message);
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert('Signup failed', error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Signup to see photos & videos from your friends</Text>
                </View>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={input.username}
                    onChangeText={(text) => setInput({ ...input, username: text })}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={input.email}
                    onChangeText={(text) => setInput({ ...input, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={input.password}
                    onChangeText={(text) => setInput({ ...input, password: text })}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={signupHandler}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Signup</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    formContainer: {
        padding: 20,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#2563eb',
        fontWeight: '600',
    }
});
