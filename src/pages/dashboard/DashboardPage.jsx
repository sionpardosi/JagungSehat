import { Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import Sidebar from '../../components/dashboard/Sidebar';

const diseaseData = [
  { name: 'Blight', value: 400 },
  { name: 'Rust', value: 300 },
  { name: 'Mosaic Virus', value: 300 },
  { name: 'Downy Mildew', value: 200 },
];

const COLORS = ['#4F46E5', '#22D3EE', '#F59E0B', '#EF4444'];

const treatmentData = [
  { name: 'Fungisida', value: 500 },
  { name: 'Bakterisida', value: 300 },
  { name: 'Insektisida', value: 200 },
  { name: 'Herbisida', value: 100 },
];

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard Disease</h1>

        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Disease Statistik</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Treatment Statistik</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={treatmentData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </section>

      </main>
    </div>
  );
};

export default DashboardPage;
