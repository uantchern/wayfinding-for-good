const { useState, useEffect, useRef, useCallback, useMemo } = React;

// --- Icons (SVGs) ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

// --- Theme & Colors ---
const GROUP_COLORS = {
    "Top-Level Domain": "#3b82f6", // Blue
    "Stakeholders & Regulators": "#8b5cf6", // Purple
    "Ecosystem Players": "#ec4899", // Pink
    "Grants & Funding Nodes": "#10b981", // Emerald
    "Governance & Issues Nodes": "#f59e0b", // Amber
};

// --- Components ---

const SidePanel = ({ node, logs, onAddLog, onClose }) => {
    const [newLogText, setNewLogText] = useState("");
    const [authorName, setAuthorName] = useState("");

    const handleLogSubmit = (e) => {
        e.preventDefault();
        if (!newLogText.trim() || !authorName.trim()) return;
        onAddLog(node.id, {
            author: authorName,
            comment: newLogText
        });
        setNewLogText("");
    };

    if (!node) return null;

    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-neutral-900/80 backdrop-blur-2xl border-l border-neutral-800 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${node ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
            {/* Header */}
            <div className="p-6 border-b border-neutral-800/50 flex justify-between items-start">
                <div>
                    <span
                        className="text-xs font-semibold tracking-wider uppercase px-2 py-1 rounded-full mb-3 inline-block"
                        style={{ color: GROUP_COLORS[node.group], backgroundColor: `${GROUP_COLORS[node.group]}20` }}
                    >
                        {node.group}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1 mb-2">{node.name}</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">{node.description}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-neutral-800/50 hover:bg-neutral-700 rounded-full text-neutral-300 transition-colors">
                    <CloseIcon />
                </button>
            </div>

            {/* Wayfinder's Log */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="flex items-center gap-2 mb-6">
                    <MapPinIcon />
                    <h3 className="text-lg font-semibold text-white">Wayfinder's Log</h3>
                </div>

                <div className="space-y-4">
                    {logs && logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log.id} className="bg-neutral-800/40 p-4 rounded-xl border border-neutral-800 relative">
                                <div className="absolute -left-2 top-4 w-4 h-[2px] bg-neutral-800"></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-medium text-emerald-400 text-sm">{log.author}</span>
                                    <span className="text-xs text-neutral-500">{log.date}</span>
                                </div>
                                <p className="text-neutral-300 text-sm">{log.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 bg-neutral-800/20 rounded-xl border border-neutral-800 border-dashed">
                            <p className="text-neutral-500 text-sm">No breadcrumbs left here yet. Be the first to guide a future wayfinder!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Form */}
            <div className="p-6 border-t border-neutral-800/50 bg-neutral-900">
                <form onSubmit={handleLogSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Your Designation (e.g. Agency Admin)"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                        required
                    />
                    <div className="relative">
                        <textarea
                            placeholder="Leave your tactical tip or insight..."
                            value={newLogText}
                            onChange={(e) => setNewLogText(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            required
                        />
                        <button
                            type="submit"
                            className="absolute bottom-3 right-3 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                            disabled={!newLogText.trim() || !authorName.trim()}
                        >
                            <SendIcon />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Header = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center pointer-events-none">
            <div className="flex flex-col gap-1 pointer-events-auto">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
                    Wayfinding for Good
                </h1>
                <p className="text-neutral-400 text-sm max-w-md">
                    "You don’t pick the path because of the destination; you discover the destination because of the path."
                </p>
            </div>

            <div className="pointer-events-auto relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search the ecosystem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-900/60 backdrop-blur-md border border-neutral-700 text-white text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-lg"
                />
            </div>
        </header>
    );
}

const Legend = () => {
    return (
        <div className="absolute bottom-6 left-6 z-10 bg-neutral-900/60 backdrop-blur-md border border-neutral-800 p-4 rounded-xl pointer-events-auto">
            <h4 className="text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-3">Ecosystem Legend</h4>
            <div className="flex flex-col gap-2">
                {Object.entries(GROUP_COLORS).map(([group, color]) => (
                    <div key={group} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
                        <span className="text-neutral-400 text-xs">{group}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const App = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [logsData, setLogsData] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const fgRef = useRef();

    useEffect(() => {
        // Load data from globals
        setGraphData({
            nodes: window.ecosystemData.nodes,
            links: window.ecosystemData.links
        });
        setLogsData(window.ecosystemData.logs);

        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter nodes based on search highlighting
    useEffect(() => {
        if (!fgRef.current || !graphData.nodes.length) return;

        let foundNode = null;
        if (searchQuery.length > 2) {
            foundNode = graphData.nodes.find(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (foundNode) {
            // Pan and zoom to node
            fgRef.current.centerAt(foundNode.x, foundNode.y, 1000);
            fgRef.current.zoom(3, 1000);
        }
    }, [searchQuery, graphData]);

    const handleNodeClick = useCallback(node => {
        if (!node) return;
        setSelectedNode(node);
        // Pan and zoom slightly
        if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(2.5, 1000);
        }
    }, []);

    const handleBackgroundClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const handleAddLog = (nodeId, logData) => {
        const newLog = {
            id: `log_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...logData
        };

        setLogsData(prev => ({
            ...prev,
            [nodeId]: [...(prev[nodeId] || []), newLog]
        }));
    };

    // Rendering Graph properties
    const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 14 / globalScale;
        ctx.font = `${fontSize}px Inter, sans-serif`;
        const textWidth = ctx.measureText(label).width;
        const isSelected = selectedNode && selectedNode.id === node.id;
        const isSearched = searchQuery.length > 2 && node.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Node circle
        const baseColor = GROUP_COLORS[node.group] || "#cccccc";
        ctx.beginPath();
        // Emphasize scale somewhat on hover or selection
        const r = (node.val || 5) * 0.8;
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = isSelected || isSearched ? "#ffffff" : baseColor;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = isSelected ? 20 : (isSearched ? 15 : 10);
        ctx.shadowColor = isSelected ? "#ffffff" : baseColor;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Label bg
        ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
        ctx.fillRect(node.x - textWidth / 2 - 2, node.y + r + 2, textWidth + 4, fontSize + 4);

        // Label text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isSelected || isSearched ? '#ffffff' : '#e5e5e5';
        ctx.fillText(label, node.x, node.y + r + 4);

    }, [selectedNode, searchQuery]);

    const linkCanvasObject = useCallback((link, ctx, globalScale) => {
        const start = link.source;
        const end = link.target;

        if (!start || !end || !start.x || !start.y) return;

        // Draw Line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        // Determine link color (fade if something is selected and not involved)
        let linkColor = "rgba(75, 85, 99, 0.4)"; // neutral-600
        const isRelated = selectedNode && (start.id === selectedNode.id || end.id === selectedNode.id);

        if (isRelated) {
            linkColor = "rgba(16, 185, 129, 0.8)"; // emerald emphasis
            ctx.lineWidth = 1.5 / globalScale;
        } else {
            ctx.lineWidth = 0.5 / globalScale;
        }

        ctx.strokeStyle = linkColor;
        ctx.stroke();

        // Draw Relation Label if zoomed in enough or related
        if (globalScale > 2.5 || isRelated) {
            const relLabel = link.relation;
            const fontSize = 10 / globalScale;
            ctx.font = `${fontSize}px Inter, sans-serif`;
            const midX = start.x + (end.x - start.x) / 2;
            const midY = start.y + (end.y - start.y) / 2;

            ctx.fillStyle = isRelated ? "#34d399" : "#9ca3af";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(relLabel, midX, midY);
        }
    }, [selectedNode]);


    return (
        <div className="w-full h-screen bg-neutral-950 overflow-hidden relative font-sans">
            {/* Gradient Background Effect */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {graphData.nodes.length > 0 && (
                <div className="w-full h-full cursor-grab active:cursor-grabbing">
                    <ForceGraph2D
                        ref={fgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeLabel="" // We custom render label
                        linkDirectionalArrowLength={3.5}
                        linkDirectionalArrowRelPos={1}
                        linkColor={() => "transparent"} // We draw link ourselves
                        nodeCanvasObject={nodeCanvasObject}
                        linkCanvasObject={linkCanvasObject}
                        onNodeClick={handleNodeClick}
                        onBackgroundClick={handleBackgroundClick}
                        d3VelocityDecay={0.4}
                        d3AlphaDecay={0.01}
                        cooldownTicks={100}
                    />
                </div>
            )}

            <Legend />

            <SidePanel
                node={selectedNode}
                logs={selectedNode ? logsData[selectedNode.id] : []}
                onAddLog={handleAddLog}
                onClose={() => setSelectedNode(null)}
            />
        </div>
    );
};

const rootStyle = { width: '100%', height: '100%', margin: 0, padding: 0 };
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
