import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const endpoint = "http://localhost:8081";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center"
      }}>
        <Main />
      </div>
    </QueryClientProvider>
  );
}
type DataType = {
  port: number;
  isRunning: boolean;
  hostUrl: string;
}

function startServer(port: number) {
  return fetch(`${endpoint}/start`, {
    body: JSON.stringify({ port }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST"
  });
}
function stopServer() {
  return fetch(`${endpoint}/stop`, {
    method: "POST"
  });
}
function mentenanta(hostUrl: string) {
  return fetch(`${hostUrl}/maintanance`);
}
function getMaintanance(hostUrl?: string) {
  return fetch(`${hostUrl}/maintanance-state`);
}
function Main() {
  const [port, setPort] = useState(8080);
  const { data, isLoading, error, refetch } = useQuery<DataType, any>('status', () =>
    fetch(`${endpoint}/status`).then(res => res.json())
  );
  const { data: maintanence, refetch: refetchMaintanence } = useQuery<{
    maintananceMode: boolean
  }, any>('maintanence', () => getMaintanance(data?.hostUrl).then(res => res.json()), {
    enabled: !!data?.hostUrl
  });
  console.log({ maintanence });

  const validationError = useMemo(() => {
    if (port < 2000 || port > 8080) {
      return {
        message: "Port should be between 2000 and 8080"
      }
    }
    return null;
  }, [port]);

  if (isLoading) {
    return <div>
      {isLoading}
    </div>
  }
  if (!data) {
    return <div>
      Data not available
    </div>
  }
  console.log({ data });
  return <div style={{
    display: "grid",
    // background: "blue",
    width: "20%",
    gap: "20px"
  }}>
    <div style={{
      color: data.isRunning ? "green" : "red"
    }}>
      {data.isRunning ? <div>
        Running on port <a href={`${data.hostUrl}/welcome`}> {data.port}</a>
      </div> : "Stopped"}
    </div>

    <TextField
      label="Port"
      size='small'
      error={!!validationError}
      type="number"
      value={port}
      helperText={validationError ? validationError.message : "Between 2000 and 8080"}
      onChange={(e) => {
        if (e.target.value) {
          setPort(+e.target.value);
        }
      }}
    />
    <FormGroup>
      <FormControlLabel
        disabled={!data.hostUrl}
        control={<Switch
          checked={maintanence?.maintananceMode}
          onChange={async (e) => {
            await mentenanta(data.hostUrl);
            refetchMaintanence();
            console.log(e.target.checked);
          }}
          disabled={!data.isRunning} />}
        label="Maintenance"
      />

    </FormGroup>

    <div style={{
      display: "flex",
      gap: "10px"
    }}>
      <Button variant="contained" disabled={data.isRunning || !!validationError} onClick={async () => {
        await startServer(port);
        refetch();
        // setIsRunning(true);
      }}>
        Start
      </Button>
      <Button variant="contained" disabled={!data.isRunning} onClick={async () => {
        await stopServer();
        refetch();
        // setIsRunning(false);
      }}>
        Stop
      </Button>
    </div>
  </div >
}

export default App;
