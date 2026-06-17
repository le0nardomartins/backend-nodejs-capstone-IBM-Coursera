import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function MainPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/secondchance/items`);
            setItems(res.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchName) params.append('name', searchName);
        if (searchCategory) params.append('category', searchCategory);
        navigate(`/search?${params.toString()}`);
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
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3">Give Items a Second Chance</h1>
                    <p className="lead mb-4">
                        Find quality second-hand items or give your unused items a new home
                    </p>
                    <form onSubmit={handleSearch} className="row g-2 justify-content-center">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control search-bar"
                                placeholder="Search by name..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-control search-bar"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="furniture">Furniture</option>
                                <option value="electronics">Electronics</option>
                                <option value="sports">Sports</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="music">Music</option>
                                <option value="hobby">Hobby</option>
                                <option value="transport">Transport</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-light btn-green fw-bold">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Items Grid */}
            <div className="container my-5">
                <h2 className="mb-4">Available Items ({items.length})</h2>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
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
                                        <span className="badge bg-light text-dark border me-2">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="card-footer bg-transparent border-0">
                                        <Link
                                            to={`/item/${item.id}`}
                                            className="btn btn-green w-100"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default MainPage;
