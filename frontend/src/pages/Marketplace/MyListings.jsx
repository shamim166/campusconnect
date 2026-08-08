import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Edit2, Trash2, CheckCircle } from "lucide-react";
import api from "../../services/api";

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await api.get('marketplace/items/my_items/');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSold = async (id) => {
    if (window.confirm("Are you sure you want to mark this item as sold?")) {
      try {
        await api.post(`marketplace/items/${id}/mark_sold/`);
        fetchMyItems(); // Refresh list
      } catch (error) {
        console.error(error);
        alert("Failed to mark item as sold.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`marketplace/items/${id}/`);
        fetchMyItems(); // Refresh list
      } catch (error) {
        console.error(error);
        alert("Failed to delete item.");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Listings</h1>
          <p className="text-gray-400">Manage the items you're selling</p>
        </div>
        <Link 
          to="/marketplace/sell"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
        >
          Post New Ad
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-300">You haven't listed any items</h3>
          <p className="text-gray-500 mb-6">Start selling your old books and gear.</p>
          <Link to="/marketplace/sell" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
            Post an Ad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-700 p-2">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
                    <Package size={40} className="text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center relative">
                <div className="flex justify-between items-start mb-2 pr-24">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Link to={`/marketplace/item/${item.id}`} className="hover:text-orange-400 transition-colors">
                      {item.title}
                    </Link>
                    {item.listing_type === 'buy' ? (
                      <span className="bg-blue-600 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">Buy</span>
                    ) : (
                      <span className="bg-orange-500 text-white text-[10px] uppercase px-2 py-0.5 rounded-full">Sell</span>
                    )}
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white mb-2">৳ {item.price}</div>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>Condition: <span className="text-gray-300 capitalize">{item.condition.replace('_', ' ')}</span></div>
                  <div>Status: 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-300 border border-gray-600'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex flex-col sm:flex-row gap-2">
                  {item.status === 'active' && (
                    <button 
                      onClick={() => handleMarkSold(item.id)}
                      className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition-colors tooltip flex items-center justify-center"
                      title="Mark as Sold"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
