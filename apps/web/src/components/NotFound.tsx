import { Link } from "@tanstack/react-router";

interface NotFoundProps {
  routeId?: string;
  [key: string]: unknown;
}

export function NotFound({}: NotFoundProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-accent transition-colors"
        >
          Go back
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
