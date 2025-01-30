import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function ProfilLeftPart({ userName = 'Utilisateur' }) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'), {
            onSuccess: () => {
                window.location.href = route('login');
            },
        });
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="h-3/4 bg-purple-700 rounded-full flex items-center justify-center mb-4">
                <User className="w-20 h-20 text-white" />
            </div>
                <h2 className="text-[clamp(1rem, 2.5vw, 2rem)] font-semibold mb-6 text-center">{userName}</h2>
                <button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                onClick={handleLogout}
                >
                <LogOut className="w-5/6" />
                Déconnexion
            </button>
        </div>
    );
}
