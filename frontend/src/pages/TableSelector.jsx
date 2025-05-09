import useTables from "../hooks/useTables.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import PageContainer from "../components/PageContainer.jsx";

export default function TableSelect({ onSelect }) {
  const { tables, loading } = useTables();

  if (loading) return <Loader />;

  return (
    <PageContainer>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {tables.map(table => (
        <Card
          key={table._id}
          className="cursor-pointer hover:shadow-xl transition text-center"
          onClick={() => onSelect(table)}
        >
          <div className="text-xl font-semibold text-primary">Mesa {table.number}</div>
          <div className="text-gray-500 capitalize">{table.status}</div>
        </Card>
      ))}
    </div>
    </PageContainer>
  );
}