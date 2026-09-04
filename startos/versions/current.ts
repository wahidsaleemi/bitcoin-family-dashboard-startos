import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.2:0',
  releaseNotes: {
    en_US:
      'Watch-only wallet balance accuracy fixes: (1) multisig descriptors with <0;1> multipath no longer double-count — each branch derives distinct addresses (a 330-sat balance that displayed as 660 now shows correctly); (2) background balance retries now back off exponentially (2m → 5m → 15m → 30m → 60m) so repeated failures no longer keep public address APIs rate-limiting the host; (3) watch-only wallet imports use a full-history rescan so funds older than 2024 are detected (a wallet with an April 2023 transaction was under-reporting by ~2.4M sats).',
    es_ES:
      'Correcciones de precisión del saldo de monederos watch-only: (1) los descriptores multisig con multipath <0;1> ya no cuentan dos veces — cada rama deriva direcciones distintas (un saldo de 330 sats que se mostraba como 660 ahora se muestra correctamente); (2) los reintentos de saldo en segundo plano ahora retroceden exponencialmente (2m → 5m → 15m → 30m → 60m) para que los fallos repetidos no mantengan las API públicas de direcciones limitando el host; (3) las importaciones de monederos watch-only usan un rescan de historial completo para detectar fondos anteriores a 2024 (un monedero con una transacción de abril de 2023 estaba subreportando ~2,4M de sats).',
    de_DE:
      'Korrekturen der Saldengenauigkeit von Watch-only-Wallets: (1) Multisig-Deskriptoren mit <0;1>-Multipath zählen nicht mehr doppelt — jeder Zweig leitet unterschiedliche Adressen ab (ein 330-Sat-Saldo, das als 660 angezeigt wurde, wird nun korrekt angezeigt); (2) Hintergrund-Saldoabrufe verwenden jetzt exponentielles Backoff (2m → 5m → 15m → 30m → 60m), sodass wiederholte Fehler öffentliche Adress-APIs nicht mehr dauerhaft rate-limiten; (3) Watch-only-Wallet-Importe verwenden einen Full-History-Rescan, sodass auch Gelder vor 2024 erkannt werden (ein Wallet mit einer Transaktion vom April 2023 meldete ~2,4 M Sats zu wenig).',
    pl_PL:
      'Poprawki dokładności sald portfeli watch-only: (1) deskryptory multisig ze ścieżką wielokrotną <0;1> nie są już podwójnie liczone — każda gałąź wyprowadza inne adresy (saldo 330 satów wyświetlane jako 660 jest teraz poprawne); (2) ponowne próby salda w tle mają teraz wykładnicze opóźnienie (2m → 5m → 15m → 30m → 60m), aby powtarzające się błędy nie utrzymywały limitów szybkości publicznych API; (3) importy portfeli watch-only używają pełnego skanowania historii, aby wykrywać środki starsze niż 2024 (portfel z transakcją z kwietnia 2023 zaniżał saldo o ~2,4 mln satów).',
    fr_FR:
      'Corrections de précision des soldes de portefeuilles watch-only : (1) les descripteurs multisig avec multipath <0;1> ne comptent plus deux fois — chaque branche dérive des adresses distinctes (un solde de 330 sats affiché comme 660 s\'affiche désormais correctement) ; (2) les nouvelles tentatives de solde en arrière-plan utilisent un backoff exponentiel (2m → 5m → 15m → 30m → 60m) afin que les échecs répétés ne maintiennent plus les API publiques d\'adresses en limite de débit ; (3) les importations de portefeuilles watch-only utilisent un rescan complet de l\'historique pour détecter les fonds antérieurs à 2024 (un portefeuille avec une transaction d\'avril 2023 sous-déclarait ~2,4 M sats).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
