import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        typingUsers: {},
    },
    reducers:{
        // actions
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        }
        ,
        addOrUpdateMessage: (state, action) => {
            const { message, tempId } = action.payload;
            // replace by _id if exists
            if (message._id) {
                const idx = state.messages.findIndex(m => m._id === message._id);
                if (idx !== -1) {
                    state.messages[idx] = { ...state.messages[idx], ...message };
                    return;
                }
            }
            // try to match by tempId
            if (tempId) {
                const idx2 = state.messages.findIndex(m => m.tempId === tempId);
                if (idx2 !== -1) {
                    state.messages[idx2] = { ...state.messages[idx2], ...message };
                    return;
                }
            }
            // fallback: try to replace the first sending message with same text
            if (message.message) {
                const idx3 = state.messages.findIndex(m => m.status === 'sending' && m.message === message.message);
                if (idx3 !== -1) {
                    state.messages[idx3] = { ...state.messages[idx3], ...message };
                    return;
                }
            }
            // otherwise append
            state.messages.push(message);
        },
        setTypingUsers: (state, action) => {
            // payload: { userId, typing }
            const { userId, typing } = action.payload;
            if (typing) state.typingUsers[userId] = true;
            else delete state.typingUsers[userId];
        }
    }
});
export const {setOnlineUsers, setMessages, addOrUpdateMessage, setTypingUsers} = chatSlice.actions;
export default chatSlice.reducer;
