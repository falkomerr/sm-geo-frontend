import { MapPin, Map, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Быстрые действия</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Button variant="outline" className="justify-start" asChild>
          <Link to="/locations">
            <MapPin className="mr-2 h-4 w-4" />
            Смотреть локации
          </Link>
        </Button>
        <Button variant="outline" className="justify-start" asChild>
          <Link to="/locations?view=map">
            <Map className="mr-2 h-4 w-4" />
            Смотреть карту
          </Link>
        </Button>
        <Button variant="outline" className="justify-start" asChild>
          <Link to="/locations?export=true">
            <Download className="mr-2 h-4 w-4" />
            Экспорт данных
          </Link>
        </Button>
      </div>
    </div>
  );
}
