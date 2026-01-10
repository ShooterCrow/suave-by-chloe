
const ToggleSwitch = ({ enabled, onChange, label }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-sans font-medium text-gray-900 dark:text-white">{label}</span>
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-white/20'}`}
                onClick={() => onChange(!enabled)}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
};

export default ToggleSwitch;
