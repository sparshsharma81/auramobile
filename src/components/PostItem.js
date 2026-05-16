import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';

export default function PostItem({ post }) {
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    const url = 'http://10.0.2.2:5000';

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`${url}/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
            }
        } catch (error) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to update like');
        }
    }

    const commentHandler = async () => {
        if (!text.trim()) return;
        try {
            const res = await axios.post(`${url}/api/v1/post/${post._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: [...p.comments, res.data.comment] } : p
                );
                dispatch(setPosts(updatedPostData));
                setText('');
            }
        } catch (error) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to add comment');
        }
    }

    return (
        <View style={styles.postContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: post.author?.profilePicture || 'https://via.placeholder.com/150' }} 
                    style={styles.avatar} 
                />
                <Text style={styles.username}>{post.author?.username}</Text>
            </View>

            {/* Image */}
            <Image 
                source={{ uri: post.image }} 
                style={styles.postImage} 
            />

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={likeOrDislikeHandler}>
                    <Text style={[styles.actionText, liked && { color: 'red' }]}>
                        {liked ? '♥' : '♡'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.actionText}>💬</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.actionText}>📤</Text>
                </TouchableOpacity>
            </View>

            {/* Likes */}
            <Text style={styles.likesText}>{postLike} likes</Text>

            {/* Caption */}
            <View style={styles.captionContainer}>
                <Text style={styles.captionUsername}>{post.author?.username} </Text>
                <Text>{post.caption}</Text>
            </View>

            {/* Comments count */}
            {post.comments.length > 0 && (
                <Text style={styles.commentsText}>View all {post.comments.length} comments</Text>
            )}

            {/* Add Comment */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={text}
                    onChangeText={setText}
                />
                {text.length > 0 && (
                    <TouchableOpacity onPress={commentHandler}>
                        <Text style={styles.postButton}>Post</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        aspectRatio: 1, // Assuming square images like Instagram
    },
    actions: {
        flexDirection: 'row',
        padding: 10,
        gap: 15,
    },
    actionText: {
        fontSize: 24,
    },
    likesText: {
        fontWeight: 'bold',
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    captionContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    captionUsername: {
        fontWeight: 'bold',
    },
    commentsText: {
        color: '#888',
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    commentInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    commentInput: {
        flex: 1,
        height: 40,
    },
    postButton: {
        color: '#2563eb',
        fontWeight: 'bold',
    }
});
