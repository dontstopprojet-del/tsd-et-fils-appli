/// <reference types="vite/client" />

declare module 'react-router-dom' {
  export function useNavigate(): (path: string) => void;
  export function useParams<T = Record<string, string>>(): T;
  export function useLocation(): { pathname: string; search: string; hash: string };
}
