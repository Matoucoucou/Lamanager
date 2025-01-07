import React, { useState } from 'react';
import logo from '../../../img/testlogo.png';
import InputLabel from "@/Components/NotUsedComponents/InputLabel.jsx";
import axios from 'axios';
import unilim from "../../../img/logo_universite.png";
import { LogIn } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { Lock } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function LoginApp() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                window.location.href = '/';
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="login-container" onSubmit={handleSubmit}>
            <img src={logo} alt="Logo" className="login-logo"/>

            <h1 className="login-title">Lamanager</h1>
            <h2 className="login-subtitle">Crachez proprement vos prévisionels</h2>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="_token" value={data._token} />
                <div className="form-group-login">
                    <div className="input-block">
                        <UserRound size={48} className="input-logo"/>

                        <div className="label-input-container">

                            <InputLabel htmlFor="email" value="Identifiant"/>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="input-rounded"
                            />
                        </div>
                    </div>

                    <div className="input-block">
                        <Lock size={48} className="input-logo"/>

                        <div className="label-input-container">

                            <InputLabel htmlFor="password" value="Mot de passe"/>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="input-rounded"
                                required={true}
                                autoComplete={"current-password"}
                            />
                        </div>
                    </div>
                    {errors.email && <p>{errors.email}</p>}
                </div>

                <div className="button-container">
                    <button type="submit" className="login-button" onClick={handleSubmit}>
                        <LogIn/>
                        Se connecter
                    </button>
                </div>
            </form>
            <img src={unilim} alt="Unilim" className="unilim-logo"/>
        </div>
    );
}
