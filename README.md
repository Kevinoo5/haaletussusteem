# Hääletussüsteem

## Kuidas see toimib?
Süsteem kasutab MySQL andmebaasi, et salvestada hääletajate poolt antud hääled. Hääletamiseks tuleb lihtsalt vajutada vastavat nuppu - "Poolt" või "Vastu". Kui hääletusaeg on läbi saanud, kuvatakse tulemused reaalajas.

## Andmebaasist ja tabelite struktuurist

Süsteem kasutab järgmisi tabeleid:

### Tabel "haaletus"
Tabel "haaletus" sisaldab järgmisi veerge:
- `id` - ainulaadne identifikaator hääletuse jaoks
- `eesnimi` - hääletaja eesnimi
- `perenimi` - hääletaja perekonnanimi
- `aeg` - hääletamise aja tempel, vaikimisi praegune aeg
- `otsus` - hääletaja otsus, võtab väärtuse 0 või 1 (0 - "Vastu", 1 - "Poolt")

### Tabel "logi"
Tabel "logi" sisaldab järgmisi veerge:
- `id` - ainulaadne identifikaator logikirjega seotud hääletuse jaoks
- `haaletus_aeg` - hääletamise aja tempel, vaikimisi praegune aeg
- `haaletaja_id` - hääletaja identifikaator, seostub "haaletus" tabeli "id" veeruga
- `otsus` - hääletaja otsus, võtab väärtuse 0 või 1 (0 - "Vastu", 1 - "Poolt")

### Tabel "tulemused"
Tabel "tulemused" sisaldab järgmisi veerge:
- `haaletanute_arv` - hääletanute koguarv
- `h_alguse_aeg` - hääletuse alguse kuupäev
- `poolt_haaled` - "Poolt" häälte arv
- `vastu_haaled` - "Vastu" häälte arv

## Piirangud
- Hääletamine on avatud ainult 11 inimesele.
- Pärast hääletamise lõppemist on võimalik muuta häält vaid nendel 11 inimesel kuni 5 minuti möödumiseni.

## Kokkuvõte
See on lihtne ja kompaktne hääletussüsteem, mis võimaldab kiiresti ja mugavalt hääletada ning jälgida reaalajas tulemusi.

