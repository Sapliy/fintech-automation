'use client';

import { useEffect } from 'react';
import { useFlowStore } from '../../store/flow.store';
import { LayoutTemplate, Plus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FlowTemplatesPage() {
    const { templates, loadTemplates, createNewFlow } = useFlowStore();
    const router = useRouter();

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    const handleUseTemplate = async (templateId: string, templateName: string) => {
        await createNewFlow(templateName, templateId);
        router.push('/'); // Go to builder
    };

    const handleCreateEmpty = async () => {
        await createNewFlow("New Automation Flow");
        router.push('/');
    };

    return (
        <div className="p-8 w-full h-full overflow-y-auto bg-gray-50">
            <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Flow Templates</h1>
                        <p className="text-gray-500">Start with a pre-built automation pattern</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Card */}
                <div
                    onClick={handleCreateEmpty}
                    className="group cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 transition-all min-h-[250px]"
                >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Blank Flow</h3>
                    <p className="text-sm text-gray-500 mt-2">Start from scratch</p>
                </div>

                {/* Template Cards */}
                {templates.map((tmpl) => (
                    <div key={tmpl.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                        <div className="h-32 bg-gray-100 flex items-center justify-center border-b border-gray-100 relative overflow-hidden group">
                            {/* Placeholder for template structure preview */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                <LayoutTemplate className="w-20 h-20 text-indigo-500 transform -rotate-12" />
                            </div>
                            <div className="z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-indigo-600 border border-indigo-100">
                                {tmpl.nodeCount || 3} Nodes
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{tmpl.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{tmpl.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {tmpl.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUseTemplate(tmpl.id, tmpl.name)}
                                className="mt-auto w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Use Template
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
