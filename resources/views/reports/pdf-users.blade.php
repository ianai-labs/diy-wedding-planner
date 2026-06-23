<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Daftar User</title>
<style>
body{font-family:sans-serif;font-size:11px}h1{text-align:center}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;text-align:left}
th{background:#f3f4f6}.nowrap{white-space:nowrap}
</style></head>
<body>
<h1>Daftar User — My Wedding Planner</h1>
<p style="text-align:center;color:#666">Tanggal: {{ now()->format('d/m/Y') }}</p>
<table><thead><tr>
<th>#</th><th>Nama</th><th>Email</th><th>Pasangan</th><th>Pernikahan</th><th>H-Hari</th><th>Budget</th><th>Spent</th><th>Task</th><th>Vendor</th>
</tr></thead><tbody>
@foreach($users as $i=>$u)
<tr>
<td>{{$i+1}}</td><td>{{$u->name}}</td><td>{{$u->email}}</td><td>{{$u->partner_name}}</td>
<td>{{$u->wedding_date?->format('d/m/Y')}}</td>
<td class="nowrap">{{$u->days_left !== null ? ($u->days_left > 0 ? "H-{$u->days_left}" : 'Lewat') : '-'}}</td>
<td>Rp {{number_format($u->total_budget,0,',','.')}}</td>
<td>Rp {{number_format($u->total_spent,0,',','.')}}</td>
<td>{{$u->tasks_count}}</td><td>{{$u->vendors_count}}</td>
</tr>
@endforeach
</tbody></table></body></html>
