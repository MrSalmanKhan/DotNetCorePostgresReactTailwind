

import { useState } from "react";
import type { Product } from "../../types/Product";
import { generateDescription } from "../../api/Products";

// Props for the product form
interface ProductFormProps {
    initialValues?: Partial<Product>;
    onSubmit: (values: Omit<Product, "id">) => void;
    onCancel: () => void;
}

/**
 * ProductForm component for adding/editing a product.
 * Handles form state and validation.
 */
export default function ProductForm({ initialValues = {}, onSubmit, onCancel }: ProductFormProps) {

    const [name, setName] = useState(initialValues.name || "");
    const [price, setPrice] = useState(initialValues.price || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiError, setAIError] = useState<string | null>(null);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            price: price ? Number(price) : 0,
            description: description || "",
        });
    };

    // Handler for AI description generation
    const handleGenerateDescription = async () => {
        if (!name) return;
        setLoadingAI(true);
        setAIError(null);
        try {
            const res = await generateDescription(name);
            setDescription(res.aiDescription || "");
        } catch (err: any) {
            setAIError(err?.response?.data?.Message || "Failed to generate description.");
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    required
                />
            </div>
            {/* Price */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>
            {/* Description + AI Button */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <button
                        type="button"
                        className="ml-2 px-4 py-1 text-xs bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors"
                        onClick={handleGenerateDescription}
                        disabled={!name || loadingAI}
                        title={!name ? 'Enter a product name first' : 'Generate AI Description'}
                    >
                        {loadingAI ? 'Generating...' : 'Generate AI Description'}
                    </button>
                </div>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                    rows={3}
                />
                {aiError && <div className="text-red-500 text-xs mt-1">{aiError}</div>}
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >Cancel</button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >Save</button>
            </div>
        </form>
    );
}
