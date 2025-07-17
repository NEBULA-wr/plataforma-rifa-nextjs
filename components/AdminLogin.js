// components/AdminLogin.js

import { useState } from 'react';
import toast from 'react-hot-toast';

const AdminLogin = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                toast.success('Acceso concedido');
                onLoginSuccess();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Error de autenticación');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-overlay">
            <div className="admin-login-modal">
                <h2 className="admin-login-title">Acceso de Administrador</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="input-style"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;