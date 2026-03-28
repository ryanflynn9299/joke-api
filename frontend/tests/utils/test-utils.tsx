import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
// Assuming standard DevModeProvider exists, otherwise we provide a mock
import { DevModeContext } from "../../src/context/DevModeContext.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialRoute?: string;
  routePath?: string;
  isDevMode?: boolean;
}

const customRender = (
  ui: ReactElement,
  {
    initialRoute = "/jokes/1",
    routePath = "/jokes/:id",
    isDevMode = false,
    ...options
  }: CustomRenderOptions = {},
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <DevModeContext.Provider value={{ isDevMode, toggleDevMode: () => {} }}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path={routePath} element={children} />
              <Route path="*" element={children} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </DevModeContext.Provider>
    );
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

export * from "@testing-library/react";
export { customRender as render };
