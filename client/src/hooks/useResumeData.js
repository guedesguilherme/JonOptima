import { useState, useCallback } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

export function useResumeData() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const saveData = useCallback(async (data) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            await setDoc(doc(db, "users", currentUser.uid), data);
        } catch (err) {
            setError(err);
            console.error("Error saving data: ", err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    const loadData = useCallback(async () => {
        if (!currentUser) return null;
        setLoading(true);
        try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (err) {
            setError(err);
            console.error("Error loading data: ", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    return { saveData, loadData, loading, error };
}
