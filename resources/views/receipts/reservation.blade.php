<!doctype html>
<html lang="bs">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #243126; font-size: 12px; }
        .header { border-bottom: 2px solid #48634c; padding-bottom: 16px; margin-bottom: 24px; }
        h1 { color: #35523a; font-size: 26px; margin: 0; }
        .muted { color: #647166; }
        .grid { width: 100%; margin-bottom: 20px; }
        .grid td { width: 50%; vertical-align: top; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #eaf0e9; text-align: left; }
        th, td { padding: 9px; border-bottom: 1px solid #d8e0d7; }
        .right { text-align: right; }
        .total { font-size: 16px; font-weight: bold; color: #35523a; }
        .footer { border-top: 1px solid #d8e0d7; color: #647166; margin-top: 28px; padding-top: 12px; }
    </style>
</head>
<body>
<div class="header">
    <h1>SportRent - račun</h1>
    <p class="muted">Broj računa: {{ $reservation->receipt_number }} | Datum izdavanja: {{ optional($reservation->completed_at)->format('d.m.Y.') }}</p>
</div>
<table class="grid"><tr>
    <td><strong>Kupac</strong><br>{{ $reservation->name }} {{ $reservation->surname }}<br>{{ $reservation->phone }}</td>
    <td><strong>Najam evidentirao/la</strong><br>{{ $reservation->user->name }} {{ $reservation->user->surname }}<br>{{ $reservation->user->email }}</td>
</tr></table>
<p><strong>Period najma:</strong> {{ \Carbon\Carbon::parse($reservation->reservation_date)->format('d.m.Y.') }} - {{ \Carbon\Carbon::parse($reservation->return_date)->format('d.m.Y.') }} ({{ $reservation->rental_days }} dana)</p>
<table>
    <thead><tr><th>Oprema</th><th>Interni broj</th><th class="right">Cijena/dan</th><th class="right">Iznos</th></tr></thead>
    <tbody>
    @foreach ($reservation->reservedEquipments as $item)
        <tr><td>{{ $item->name }}</td><td>{{ $item->internal_registration_number }}</td><td class="right">{{ number_format($item->pivot->daily_price ?? $item->price, 2) }} KM</td><td class="right">{{ number_format(($item->pivot->daily_price ?? $item->price) * $reservation->rental_days, 2) }} KM</td></tr>
    @endforeach
    </tbody>
</table>
<p class="right total">Ukupno: {{ number_format($reservation->total_price, 2) }} KM</p>
<p><strong>Status plaćanja:</strong> {{ $reservation->payment_status === 'paid' ? 'Plaćeno' : 'Nije plaćeno' }}@if($reservation->payment_method) ({{ ['cash' => 'Gotovina', 'card' => 'Kartica', 'bank_transfer' => 'Bankovni transfer'][$reservation->payment_method] }})@endif</p>
<div class="footer">Hvala što koristite SportRent.</div>
</body>
</html>
