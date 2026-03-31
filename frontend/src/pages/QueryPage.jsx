import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { queryDocuments } from '../services/api';

const EQUIPMENT_TYPES = ['CNC', '沖壓機', '射出成型機', '綜合'];

export default function QueryPage() {
  const [question, setQuestion] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleQuery = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const payload = { question: question.trim(), top_k: 3 };
      if (equipmentType) payload.equipment_type = equipmentType;
      const res = await queryDocuments(payload);
      const newResult = { question: question.trim(), ...res.data };
      setResult(newResult);
      setHistory((prev) => [newResult, ...prev]);
    } catch {
      setError('Query failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Knowledge Query</Typography>

      {/* Query Input */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Ask a question..."
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 300 }}
          />
          <FormControl size="medium" sx={{ minWidth: 160 }}>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={equipmentType}
              label="Equipment Type"
              onChange={(e) => setEquipmentType(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {EQUIPMENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleQuery}
            disabled={loading || !question.trim()}
            sx={{ height: 56 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>
      </Paper>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Answer */}
      {result && !loading && (
        <Box sx={{ mb: 3 }}>
          <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Answer
                <Chip label={`method: ${result.search_method}`} size="small" sx={{ ml: 1 }} />
                <Chip label={`model: ${result.model_used}`} size="small" sx={{ ml: 0.5 }} />
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {result.answer}
              </Typography>
            </CardContent>
          </Card>

          {/* Sources */}
          {result.sources && result.sources.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Sources ({result.sources.length})
              </Typography>
              {result.sources.map((source, idx) => (
                <Accordion key={source.document_id + idx} defaultExpanded={idx === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography sx={{ flex: 1 }}>{source.title}</Typography>
                      <Chip
                        label={`${(source.relevance_score * 100).toFixed(0)}%`}
                        size="small"
                        color={source.relevance_score > 0.7 ? 'success' : source.relevance_score > 0.4 ? 'warning' : 'default'}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                      {source.relevant_snippet}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {result.sources && result.sources.length === 0 && (
            <Alert severity="info">No relevant documents found for this query.</Alert>
          )}
        </Box>
      )}

      {/* History */}
      {history.length > 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Previous Queries</Typography>
          {history.slice(1).map((item, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 1 }} variant="outlined">
              <Typography variant="subtitle2" color="primary">{item.question}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {item.answer.substring(0, 120)}...
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Ask a question about your equipment
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            e.g. "CNC 車床出現異常震動該怎麼處理？"
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
