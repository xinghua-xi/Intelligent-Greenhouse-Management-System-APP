import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Droplets, Sun, Wind, CloudRain, Cpu, AlertCircle } from 'lucide-react-native';

const data = [
  { time: '00:00', temp: 18, hum: 80 },
  { time: '04:00', temp: 16, hum: 85 },
  { time: '08:00', temp: 22, hum: 70 },
  { time: '12:00', temp: 28, hum: 55 },
  { time: '16:00', temp: 26, hum: 60 },
  { time: '20:00', temp: 20, hum: 75 },
  { time: '24:00', temp: 19, hum: 82 },
];

const OverviewExpert: React.FC = () => {
  return (
    <div className="min-h-full bg-slate-900 text-slate-200 p-4 animate-fade-in pb-24">
        <header className="flex justify-between items-center mb-6 pt-2">
            <div>
                <h1 className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <Cpu size={20} /> 
                    SYSTEM_MONITOR
                </h1>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">NODE_ID: GH-01-MASTER | UPTIME: 42D 12H</p>
            </div>
            <div className="text-right">
                <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    STATUS: ONLINE
                </div>
            </div>
        </header>

        {/* 1. Main Charts */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 font-mono">ENV_TRENDS (24H)</h3>
                <div className="flex gap-4 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> TEMP</span>
                    <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> HUM</span>
                </div>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}}
                            itemStyle={{fontSize: '12px'}}
                            labelStyle={{color: '#94a3b8', fontSize: '10px', marginBottom: '4px'}}
                        />
                        <Area type="monotone" dataKey="temp" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                        <Area type="monotone" dataKey="hum" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorHum)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 2. Sensor Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
            <SensorCard label="AIR_TEMP" value="24.5" unit="°C" icon={Thermometer} color="text-emerald-400" />
            <SensorCard label="AIR_HUM" value="65.2" unit="%" icon={Droplets} color="text-blue-400" />
            <SensorCard label="SOIL_VWC" value="42.1" unit="%" icon={CloudRain} color="text-amber-400" />
            <SensorCard label="SOLAR_RAD" value="850" unit="W/m²" icon={Sun} color="text-yellow-400" />
            <SensorCard label="CO2_LVL" value="420" unit="ppm" icon={Wind} color="text-slate-400" />
            <SensorCard label="VPD" value="0.85" unit="kPa" icon={Activity} color="text-indigo-400" />
        </div>

        {/* 3. Detailed Logs / Anomalies */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-slate-400 font-mono">EVENT_LOGS</h3>
                 <button className="text-[10px] text-emerald-400 hover:text-emerald-300">EXPORT_CSV</button>
            </div>
            <div className="divide-y divide-slate-700/50">
                <LogItem time="10:23:45" level="WARN" module="PUMP_CTRL" msg="Flow rate deviation > 5%" />
                <LogItem time="09:15:22" level="INFO" module="AI_CORE" msg="Irrigation schedule optimized" />
                <LogItem time="08:00:00" level="INFO" module="SYS" msg="Daily backup completed" />
            </div>
        </div>
    </div>
  );
};

const SensorCard: React.FC<{label: string, value: string, unit: string, icon: any, color: string}> = ({label, value, unit, icon: Icon, color}) => (
    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors group">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-500">{label}</span>
            <Icon size={14} className={`${color} opacity-70 group-hover:opacity-100 transition-opacity`} />
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-slate-200">{value}</span>
            <span className="text-[10px] text-slate-500 font-mono">{unit}</span>
        </div>
    </div>
);

const LogItem: React.FC<{time: string, level: string, module: string, msg: string}> = ({time, level, module, msg}) => (
    <div className="px-4 py-2.5 flex gap-3 items-start text-[10px] font-mono hover:bg-slate-800 transition-colors">
        <span className="text-slate-500 whitespace-nowrap">{time}</span>
        <span className={`font-bold ${level === 'WARN' ? 'text-amber-500' : 'text-blue-400'}`}>{level}</span>
        <span className="text-slate-400 w-16 whitespace-nowrap overflow-hidden text-ellipsis">{module}</span>
        <span className="text-slate-300 flex-1">{msg}</span>
    </div>
);

export default OverviewExpert;