import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';
import PostItem from '../components/PostItem';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);
    const url = 'http://10.0.2.2:5000';

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${url}/api/v1/post/all`, { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                });
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        }
        fetchAllPost();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Aura</Text>
            </View>
            
            {!posts ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <PostItem post={item} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
