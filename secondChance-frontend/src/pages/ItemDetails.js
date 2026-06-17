import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || '';

function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sentiment, setSentiment] = useState(null);
    const [comment, setComment] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/secondchance/items/${id}`);
            setItem(res.data);
        } catch (error) {
            console.error('Error fetching item:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzeSentiment = async () => {
        try {
            const res = await axios.post('/sentiment', { text: comment });
            setSentiment(res.data);
        } catch (error) {
            console.error('Sentiment error:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`${API_URL}/api/secondchance/items/${id}`);
                navigate('/');
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const getConditionBadgeClass = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'like new': return 'bg-success';
            case 'excellent': return 'bg-primary';
            case 'good': return 'bg-info';
            case 'fair': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-success" role="status" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container py-5 text-center">
                <h2>Item not found</h2>
                <button className="btn btn-green mt-3" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={item.image || 'https://placehold.co/600x400?text=No+Image'}
                        alt={item.name}
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="fw-bold">{item.name}</h1>
                    <span className={`badge ${getConditionBadgeClass(item.condition)} fs-6 mb-3`}>
                        {item.condition}
                    </span>

                    <div className="mb-3">
                        <span className="badge bg-light text-dark border me-2 fs-6">
                            {item.category}
                        </span>
                        <span className="text-muted small">
                            Age: {item.age_years ? `${item.age_years} years` : `${item.age_days} days`}
                        </span>
                    </div>

                    <p className="text-muted">{item.description}</p>

                    <div className="card bg-light p-3 mb-3">
                        <h6 className="fw-bold">Contact Details</h6>
                        <p className="mb-0">{item.contact_details}</p>
                    </div>

                    <p className="text-muted small">Posted: {item.date_added}</p>

                    {user && (
                        <button
                            className="btn btn-danger mt-2"
                            onClick={handleDelete}
                        >
                            Delete Item
                        </button>
                    )}
                </div>
            </div>

            {/* Comment & Sentiment */}
            <div className="mt-5">
                <h4>Leave a Comment</h4>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="What do you think about this item?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-green" onClick={analyzeSentiment}>
                        Analyze
                    </button>
                </div>
                {sentiment && (
                    <div className={`alert mt-3 ${sentiment.sentiment === 'positive' ? 'alert-success' : sentiment.sentiment === 'negative' ? 'alert-danger' : 'alert-secondary'}`}>
                        Sentiment: <strong>{sentiment.sentiment}</strong> (score: {sentiment.score?.toFixed(2)})
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemDetails;
