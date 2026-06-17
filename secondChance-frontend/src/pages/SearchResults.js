import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function SearchResults() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        searchItems();
    }, [location.search]);

    const searchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/secondchance/search${location.search}`);
            setItems(res.data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
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

    return (
        <div className="container my-5">
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/')}>
                    ← Back
                </button>
                <div>
                    <h2 className="mb-0">Search Results</h2>
                    <p className="text-muted mb-0">
                        {params.get('name') && <span>Name: "{params.get('name')}" </span>}
                        {params.get('category') && <span>Category: "{params.get('category')}"</span>}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="text-muted">No items found matching your search</h4>
                    <button className="btn btn-green mt-3" onClick={() => navigate('/')}>
                        Browse All Items
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-muted mb-3">{items.length} item(s) found</p>
                    <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                        {items.map(item => (
                            <div className="col" key={item.id}>
                                <div className="card item-card h-100">
                                    <img
                                        src={item.image || 'https://placehold.co/400x300?text=No+Image'}
                                        className="card-img-top"
                                        alt={item.name}
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <span className={`badge ${getConditionBadgeClass(item.condition)} badge-condition mb-2`}>
                                            {item.condition}
                                        </span>
                                        <p className="card-text text-muted small">
                                            {item.description?.substring(0, 80)}...
                                        </p>
                                        <span className="badge bg-light text-dark border">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="card-footer bg-transparent border-0">
                                        <Link to={`/item/${item.id}`} className="btn btn-green w-100">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchResults;
