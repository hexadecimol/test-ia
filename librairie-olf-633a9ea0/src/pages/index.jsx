import Layout from "./Layout.jsx";

import Home from "./Home";

import Books from "./Books";

import Search from "./Search";

import AdvancedSearch from "./AdvancedSearch";

import BookDetail from "./BookDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Books: Books,
    
    Search: Search,
    
    AdvancedSearch: AdvancedSearch,
    
    BookDetail: BookDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Books" element={<Books />} />
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/AdvancedSearch" element={<AdvancedSearch />} />
                
                <Route path="/BookDetail" element={<BookDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}