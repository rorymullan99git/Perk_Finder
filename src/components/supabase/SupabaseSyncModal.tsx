'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { seedSupabaseDatabase, SeedResult } from '@/lib/supabase/seeder';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  Server
} from 'lucide-react';

interface SupabaseSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState<'checking' | 'ready' | 'missing'>('checking');
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';

  // Check if tables are present in Supabase
  const checkStatus = async () => {
    setLoading(true);
    setSeedResult(null);
    try {
      const { data, error } = await supabase.from('banks').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          setSchemaStatus('missing');
        } else {
          setSchemaStatus('missing');
        }
      } else {
        setSchemaStatus('ready');
      }
    } catch {
      setSchemaStatus('missing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      checkStatus();
    }
  }, [open]);

  const copySchemaSql = async () => {
    try {
      const response = await fetch('/api/schema-sql');
      if (response.ok) {
        const sql = await response.text();
        await navigator.clipboard.writeText(sql);
      } else {
        await navigator.clipboard.writeText(`-- Open supabase/schema.sql in PerkPilot AU project`);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    const result = await seedSupabaseDatabase();
    setSeedResult(result);
    setLoading(false);
    if (result.success) {
      setSchemaStatus('ready');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
            <Database className="h-4 w-4" />
          </div>
          <DialogTitle>Supabase Cloud Connection & Seeder</DialogTitle>
        </div>
        <DialogDescription>
          PerkPilot AU syncs pure financial math datasets with your Supabase PostgreSQL database.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 text-xs">
        {/* Connection details */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-600 dark:text-stone-300">Project Endpoint:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {supabaseUrl}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-600 dark:text-stone-300">Database Schema:</span>
            {schemaStatus === 'checking' ? (
              <Badge variant="secondary">Checking...</Badge>
            ) : schemaStatus === 'ready' ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Tables Active
              </Badge>
            ) : (
              <Badge variant="warning" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                SQL Schema Required
              </Badge>
            )}
          </div>
        </div>

        {/* Step-by-step instructions if schema is not run yet */}
        {schemaStatus === 'missing' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
              <Server className="h-4 w-4" />
              <span>Initialize Supabase Relational Tables</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
              To apply the relational schema (`banks`, `products`, `merchants`, `perk_offers`, `deposit_rates`) with Row Level Security:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-stone-700 dark:text-stone-300">
              <li>Open your <strong>supabase/schema.sql</strong> file in the project.</li>
              <li>Or click below to open your <strong>Supabase SQL Editor</strong> and run the script.</li>
            </ol>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-xs transition-colors"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={checkStatus}
                disabled={loading}
                className="text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Re-check Status
              </Button>
            </div>
          </div>
        )}

        {/* Seed Action */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-stone-900 dark:text-white">Seed Australian Financial Data</h4>
              <p className="text-xs text-stone-600">
                Populates 25+ cards, 20+ retailers, 40+ perks, and 15+ deposit rates into Supabase.
              </p>
            </div>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleSeed}
              disabled={loading}
              className="text-xs font-bold"
            >
              {loading ? 'Seeding...' : 'Run Seeder'}
            </Button>
          </div>

          {seedResult && (
            <div className={`p-3 rounded-xl text-xs ${
              seedResult.success 
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200'
            }`}>
              <div className="font-semibold">{seedResult.message}</div>
              {seedResult.counts && (
                <div className="mt-1 grid grid-cols-3 gap-2 text-xs font-mono">
                  <span>Banks: {seedResult.counts.banks}</span>
                  <span>Products: {seedResult.counts.products}</span>
                  <span>Merchants: {seedResult.counts.merchants}</span>
                  <span>Perks: {seedResult.counts.perkOffers}</span>
                  <span>Deposits: {seedResult.counts.depositRates}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
