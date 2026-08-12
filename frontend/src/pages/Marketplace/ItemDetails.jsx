import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Share2, Tag, Book, User, Phone, Edit, Trash2, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = () => {
    api.get(`marketplace/items/${id}/`).then(res => {
      setItem(res.data);
      setEditForm({
        title: res.data.title,
        price: res.data.price,
        condition: res.data.condition,
        course_code: res.data.course_code || "",
        department: res.data.department || "",
        semester: res.data.semester || "",
        description: res.data.description || "",
      });
      setLoading(false);
    }).catch(console.error);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleteLoading(true);
    try {
      await api.delete(`marketplace/items/${id}/`);
      toast.success("Item deleted successfully");
      navigate("/marketplace");
    } catch (e) {
      toast.error("Failed to delete item");
      setDeleteLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setSaving(true);
    try {
      await api.patch(`marketplace/items/${id}/`, editForm);
      toast.success("Item updated successfully");
      setShowEdit(false);
      fetchItem();
    } catch (e) {
      toast.error("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full py-20">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!item) return <div className="text-white text-center py-20">Item not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image */}
        <div className="md:w-1/2 bg-gray-900 flex items-center justify-center p-8 min-h-[400px]">
          {item.image ? (
            <img src={item.image} alt={item.title} className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl" />
          ) : (
            <Book size={120} className="text-gray-700" />
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-orange-900/50 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 uppercase tracking-wider">
              {item.category_name || "Item"}
            </span>
            {item.listing_type === 'buy' ? (
              <span className="ml-2 bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
                Looking to Buy
              </span>
            ) : (
              <span className="ml-2 bg-orange-900/50 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 uppercase tracking-wider">
                For Sale
              </span>
            )}
            <div className="flex gap-2">
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 transition-colors">
                <Share2 size={18} />
              </button>
              <button className={`p-2 rounded-full transition-colors ${item.is_saved ? 'bg-red-900/50 text-red-500' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                <Heart size={18} fill={item.is_saved ? "currentColor" : "none"} />
              </button>
            </div>
            </div>

          <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
          
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-white">৳ {item.price}</span>
            {item.is_negotiable && (
              <span className="text-sm text-green-400 font-medium mb-1 flex items-center gap-1">
                <Tag size={14} /> Negotiable
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Condition</p>
              <p className="text-white font-medium capitalize">{item.condition.replace('_', ' ')}</p>
            </div>
            {item.course_code && (
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Course Code</p>
                <p className="text-purple-400 font-mono font-medium">{item.course_code}</p>
              </div>
            )}
            {item.department && (
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Department</p>
                <p className="text-white font-medium">{item.department}</p>
              </div>
            )}
            {item.semester && (
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Semester</p>
                <p className="text-white font-medium">{item.semester}</p>
              </div>
            )}
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Listed by</p>
                  <p className="text-white font-bold">{item.seller_name}</p>
                </div>
              </div>
              {item.seller_phone && (
                <div className="text-right">
                  <p className="text-sm text-gray-400 font-medium flex items-center justify-end gap-1"><Phone size={12}/> Phone</p>
                  <p className="text-white font-bold">{item.seller_phone}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={20} />
                {item.listing_type === 'buy' ? 'Chat with Buyer' : 'Chat with Seller'}
              </button>
              {item.is_negotiable && (
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-colors border border-gray-600">
                  {item.listing_type === 'buy' ? 'Propose Price' : 'Make Offer'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Item</h2>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Title</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-bold mb-2">Price (৳)</label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm font-bold mb-2">Condition</label>
                  <select value={editForm.condition} onChange={e => setEditForm({...editForm, condition: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowEdit(false)} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={handleEditSubmit} disabled={saving} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
