import test from 'node:test';
import assert from 'node:assert/strict';
import { USERS, makeDocs, permittedDocs, rangeFor, filterEvents, totals, series } from '../src/model.js';
test('HR account never retrieves sales or legal knowledge',()=>{assert.ok(permittedDocs(makeDocs(),USERS[1],'hr',true).every(d=>['hr','public'].includes(d.space)));});
test('multi-workspace knowledge defaults to current workspace; unpublished excluded',()=>{const docs=makeDocs();docs[2].status='待审核';const visible=permittedDocs(docs,USERS[0],'hr');assert.ok(visible.every(d=>['hr','public'].includes(d.space)));assert.ok(!visible.some(d=>d.id==='doc-2'));assert.ok(permittedDocs(docs,USERS[0],'hr',true).some(d=>d.space==='legal'));});
test('rolling seven-day range contains seven calendar days',()=>{const r=rangeFor('最近7天');assert.equal(Math.round((new Date(r.end)-new Date(r.start))/86400000),6);});
test('cost and time aggregated only in selected workspace and date range',()=>{const es=[{space:'hr',date:'2026-10-14',saved:60,cost:2,calls:1,input:3,output:4},{space:'legal',date:'2026-10-14',saved:120,cost:3,calls:2,input:3,output:4}];const a=filterEvents(es,{start:'2026-10-14',end:'2026-10-14'},'hr');assert.equal(totals(a).cost,2);assert.equal(totals(a).saved,60);assert.equal(series(a,{start:'2026-10-14',end:'2026-10-14'},'日')[0].value,1);});
