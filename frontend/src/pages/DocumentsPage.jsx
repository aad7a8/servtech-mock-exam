import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchDocuments, createDocument, deleteDocument } from '../services/api';

const EQUIPMENT_TYPES = ['CNC', '沖壓機', '射出成型機', '綜合'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [form, setForm] = useState({ title: '', content: '', equipment_type: '', tags: [] });
  const [formError, setFormError] = useState({});

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.equipment_type = filterType;
      const res = await fetchDocuments(params);
      setDocuments(res.data || []);
    } catch {
      setSnack({ open: true, message: 'Failed to load documents', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const handleCreate = async () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.content.trim()) errors.content = 'Content is required';
    if (!form.equipment_type.trim()) errors.equipment_type = 'Equipment type is required';
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }
    try {
      await createDocument(form);
      setOpenCreate(false);
      setForm({ title: '', content: '', equipment_type: '', tags: [] });
      setFormError({});
      setSnack({ open: true, message: 'Document created', severity: 'success' });
      loadDocuments();
    } catch {
      setSnack({ open: true, message: 'Failed to create document', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!openDelete) return;
    try {
      await deleteDocument(openDelete.id);
      setOpenDelete(null);
      setSnack({ open: true, message: 'Document deleted', severity: 'success' });
      loadDocuments();
    } catch {
      setSnack({ open: true, message: 'Failed to delete document', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Documents</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={filterType}
              label="Equipment Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {EQUIPMENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            New Document
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No documents found</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Click "New Document" to add your first knowledge document.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Equipment Type</strong></TableCell>
                <TableCell><strong>Tags</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    <Chip label={doc.equipment_type} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {doc.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => setOpenDelete(doc)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Document</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={!!formError.title}
            helperText={formError.title}
            inputProps={{ maxLength: 200 }}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            error={!!formError.content}
            helperText={formError.content}
          />
          <FormControl fullWidth margin="normal" error={!!formError.equipment_type}>
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={form.equipment_type}
              label="Equipment Type"
              onChange={(e) => setForm({ ...form, equipment_type: e.target.value })}
            >
              {EQUIPMENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            freeSolo
            options={['操作', '安全', '維護', '刀具', 'SOP', '參數', '調整', '緊急應變']}
            value={form.tags}
            onChange={(_, newVal) => setForm({ ...form, tags: newVal })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" margin="normal" placeholder="Add tags" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!openDelete} onClose={() => setOpenDelete(null)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{openDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
