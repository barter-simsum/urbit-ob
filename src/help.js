const text = `
Prints the children of a star matching certain criteria to STDOUT

Usage: node star-stripmine.js [--geom=GEOM] [--name=PATTERN] [--bl=FILE] STAR

STAR          your star's @p, e.g. "~tiptyn"

--geom GEOM   a geometry to match of the form "GEO1,GEO2-GEO3,GEO4". A planet's
              geometry looks likes this:
                  GEO1  |  GEO2
                  GEO3  |  GEO4
              Urbit sigils are made up of 12 fundamental shapes which are further
              differentiated by shading/character markings. These fundamental
              shapes are:
                  - circle   (sic)
                  - square   (sic)
                  - u        (shaped like a filled in U)
                  - revu     (reverse U)
                  - rru      (90° counter-clockwise rotation U)
                  - lru      (90° clockwise rotation U)
                  - upleaf   (中文 tone 2)
                  - downleaf (中文 tone 4)
                  - c0       (semi-circle 90° angle in first caresian quadrant)
                  - c90      (semi-circle 90° angle in second caresian quadrant)
                  - c180     (semi-circle 90° angle in third caresian quadrant)
                  - c270     (semi-circle 90° angle in fourth caresian quadrant)

              You can filter planets by these named geometries, but not by their
              shading/character markings. You can also specify '*' to say "any
              geometry"

              To see what these abbreviations mean. Run with the --describe-geoms
              arg.

--name PATT   A regex pattern to match a planet's @p against. Uses standard
              javascript syntax, e.g.

              .{3}(.{3})-.{3}\\1 -> match ~barter-morter, ~zodzod-dozzod, ~tonros-rosros, etc.

              (.{3})(.{3})-\\1\\2 -> match ~barter-barter, ~dozzod-dozzod, ~molwex-molwex, etc.

              (.{3})\\1-\\1\\1      -> match ~barbar-barbar, note this is impossible. No
                                    suffix is also a prefix. asdfasdf

              To see a list of phonemes, Run with the --describe-phonemes arg.

--blacklist FILE     A blacklist of @ps to ignore - one per line.

-q             Only output the matches and no other information.

For planet search inspiration, use:
https://urbit.me/about/rarest-urbit-sigils
`;

const geos = `
circle

      ---------
    -/         \\-
   /             \\
  (               )
   \\             /
    -\\         /-
      ---------

square

    +-------------+
    |             |
    |             |
    |             |
    |             |
    +-------------+


               u                /                revu                /                rru                /                lru

      +-----------------+                      /--------                     +-------------                           -----------+
      |                 |                     /         -\\                   |             --\\                      -/           |
      |                 |                   -/            -\\                 |                -+                  +/             |
      |                 |                  |                \\                |                 |                  |              |
      |                 /                  |                |                |                /+                  +-             |
      +\\               /+                  |                |                |             /--                      \\--          |
        --\\          /--                   |                |                +-------------                            \\---------+
           \\--------/                      +----------------+






                 upleaf                 /                 downleaf

                 .........                         ....
              ....       .                       ..   .......
            ...          .                       ..         ....
           ..            .                        .            ...
          .              .                        .              ..
        ..              ..                        .               ..
       ..              ..                         ...              .
      ..            ...                             ....            ..
     ..           ...                                   .........    ...
     .............                                              ........




circle quarters
               c0               /               c90               /               c180               /               c270


     +------                                         ------+                 +---------------+                +---------------+
     |      \\--                                  ---/      |                 |               |                |               |
     |         \\-                             /-/          |                 +-              |                |               |
     |           --                         -/             |                   \\\\            |                |              /+
     |             \\+                      |               |                     \\-          |                |           /--
     |              |                      |               |                       ----      |                |      /----
     +--------------+                      +---------------+                           \\-----+                +------
`;

const phonemes = `
prefix
000 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015
doz mar bin wan sam lit sig hid fid lis sog dir wac sab wis sib
016 017 018 019 020 021 022 023 024 025 026 027 028 029 030 031
rig sol dop mod fog lid hop dar dor lor hod fol rin tog sil mir
032 033 034 035 036 037 038 039 040 041 042 043 044 045 046 047
hol pas lac rov liv dal sat lib tab han tic pid tor bol fos dot
048 049 050 051 052 053 054 055 056 057 058 059 060 061 062 063
los dil for pil ram tir win tad bic dif roc wid bis das mid lop
064 065 066 067 068 069 070 071 072 073 074 075 076 077 078 079
ril nar dap mol san loc nov sit nid tip sic rop wit nat pan min
080 081 082 083 084 085 086 087 088 089 090 091 092 093 094 095
rit pod mot tam tol sav pos nap nop som fin fon ban mor wor sip
096 097 098 099 100 101 102 103 104 105 106 107 108 109 110 111
ron nor bot wic soc wat dol mag pic dav bid bal tim tas mal lig
112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127
siv tag pad sal div dac tan sid fab tar mon ran nis wol mis pal
128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143
las dis map rab tob rol lat lon nod nav fig nom nib pag sop ral
144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159
bil had doc rid moc pac rav rip fal tod til tin hap mic fan pat
160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175
tac lab mog sim son pin lom ric tap fir has bos bat poc hac tid
176 177 178 179 180 181 182 183 184 185 186 187 188 189 190 191
hav sap lin dib hos dab bit bar rac par lod dos bor toc hil mac
192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207
tom dig fil fas mit hob har mig hin rad mas hal rag lag fad top
208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223
mop hab nil nos mil fop fam dat nol din hat nac ris fot rib hoc
224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239
nim lar fit wal rap sar nal mos lan don dan lad dov riv bac pol
240 241 242 243 244 245 246 247 248 249 250 251 252 253 254 255
lap tal pit nam bon ros ton fod pon sov noc sor lav mat mip fip

suffix
000 001 002 003 004 005 006 007 008 009 010 011 012 013 014 015
zod nec bud wes sev per sut let ful pen syt dur wep ser wyl sun
016 017 018 019 020 021 022 023 024 025 026 027 028 029 030 031
ryp syx dyr nup heb peg lup dep dys put lug hec ryt tyv syd nex
032 033 034 035 036 037 038 039 040 041 042 043 044 045 046 047
lun mep lut sep pes del sul ped tem led tul met wen byn hex feb
048 049 050 051 052 053 054 055 056 057 058 059 060 061 062 063
pyl dul het mev rut tyl wyd tep bes dex sef wyc bur der nep pur
064 065 066 067 068 069 070 071 072 073 074 075 076 077 078 079
rys reb den nut sub pet rul syn reg tyd sup sem wyn rec meg net
080 081 082 083 084 085 086 087 088 089 090 091 092 093 094 095
sec mul nym tev web sum mut nyx rex teb fus hep ben mus wyx sym
096 097 098 099 100 101 102 103 104 105 106 107 108 109 110 111
sel ruc dec wex syr wet dyl myn mes det bet bel tux tug myr pel
112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127
syp ter meb set dut deg tex sur fel tud nux rux ren wyt nub med
128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143
lyt dus neb rum tyn seg lyx pun res red fun rev ref mec ted rus
144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159
bex leb dux ryn num pyx ryg ryx fep tyr tus tyc leg nem fer mer
160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175
ten lus nus syl tec mex pub rym tuc fyl lep deb ber mug hut tun
176 177 178 179 180 181 182 183 184 185 186 187 188 189 190 191
byl sud pem dev lur def bus bep run mel pex dyt byt typ lev myl
192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207
wed duc fur fex nul luc len ner lex rup ned lec ryd lyd fen wel
208 209 210 211 212 213 214 215 216 217 218 219 220 221 222 223
nyd hus rel rud nes hes fet des ret dun ler nyr seb hul ryl lud
224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239
rem lys fyn wer ryc sug nys nyl lyn dyn dem lux fed sed bec mun
240 241 242 243 244 245 246 247 248 249 250 251 252 253 254 255
lyr tes mud nyt byr sen weg fyr mur tel rep teg pec nel nev fes
`;

function help(status=0) {
    console.log(text);
    process.exit(status);
}

function describe_geos(status=0) {
    console.log(geos);
    process.exit(status);
}

function describe_phonemes(status=0) {
    console.log(phonemes);
    process.exit(status);
}

module.exports = {
    help,
    describe_geos,
    describe_phonemes,
};
