import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // 1. Initial State: Now we also try to load the user from localStorage
    user: JSON.parse(localStorage.getItem('devsync_user')) || null, 
    token: localStorage.getItem('devsync_token') || null,
    isAuthenticated: !!localStorage.getItem('devsync_token'),

    // 2. The Login Action: Save both token AND user data to localStorage
    login: (userData, token) => {
        localStorage.setItem('devsync_token', token);
        // localStorage can only store strings, so we convert the JSON object
        localStorage.setItem('devsync_user', JSON.stringify(userData)); 
        
        set({ 
            user: userData, 
            token: token, 
            isAuthenticated: true 
        });
    },

    // 3. The Logout Action: Clear both from localStorage
    logout: () => {
        localStorage.removeItem('devsync_token');
        localStorage.removeItem('devsync_user');
        
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
        });
    }
}));

export default useAuthStore;



