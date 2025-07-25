// @ts-nocheck

import { Match, Switch, lazy } from "solid-js";
import ApiListView from "./views/ApiListView";
import ApiView from "./views/ApiView";
import PageNotFound from "./views/PageNotFound";

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (target: URLSearchParams, prop: string) => target.get(prop),
});

function App() {
  const page = params.page;
  return (
    <div class="fade-in">
      <Switch fallback={<PageNotFound />}>
        <Match when={!page}>
          <ApiListView />
        </Match>
        <Match when={page === "api"}>
          <ApiView category={params.category} />
        </Match>
        <Match when={page === "MiniApp"}>
          {lazy(() => import("./views/OtherViews/MiniApp"))}
        </Match>
        <Match when={page === "SQLite"}>
          {lazy(() => import("./views/OtherViews/SQLite"))}
        </Match>
        <Match when={page === "FileSystem"}>
          {lazy(() => import("./views/OtherViews/FileSystem"))}
        </Match>
      </Switch>
    </div>
  );
}

export default App;
