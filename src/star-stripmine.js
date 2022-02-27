/*

bollux
topten
patter
magnus
pilled
larped
dotnet
ranter
normes

node star-stripmine.js --blacklist=./blacklist --geom="downleaf,upleaf-c0,c90" "~sampel"

pretty neat. somewhat rare:

node star-stripmine.js -q --blacklist=./blacklist --geom="downleaf,upleaf-circle,downleaf" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

node star-stripmine.js -q --blacklist=./blacklist --geom="upleaf,circle-upleaf,circle" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

node star-stripmine.js -q --blacklist=./blacklist --geom="upleaf,square-square,upleaf" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

sword pattern
node star-stripmine.js --blacklist=./blacklist --name=".*" --geom="downleaf,c270-c270,*" -q "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

false angel ~40:
node star-stripmine.js --geom="c180,rru-c90,rru" -q "~sampel" | shuf | head | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

squirrel:
node star-stripmine.js --blacklist=./blacklist -q --geom="lru,c90-c90,c270" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

turtle (the converse has already been explored. - none): only 5
node star-stripmine.js -q --blacklist=./blacklist --name="(nex|lyt)-" --geom="c90,rru-c180,c0" "~sampel"

tulip: - only 2
node star-stripmine.js -q --blacklist=./blacklist --geom="c0,c90-c180,c270" "~sampel"

flower ~10:
node star-stripmine.js -q --blacklist=./blacklist --geom="c180,c270-downleaf,upleaf" "~sampel"

balls on leaves ~10:
node star-stripmine.js -q --blacklist=./blacklist --geom="circle,circle-downleaf,upleaf" "~sampel"

cherries ~10:
node star-stripmine.js -q --blacklist=./blacklist --geom="downleaf,upleaf-circle,circle" "~sampel"

manta ray dexter: only 7
node star-stripmine.js -q --blacklist=./blacklist --geom="c0,c270-c180,c0" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"
manta ray sinister: only 7
node star-stripmine.js -q --blacklist=./blacklist --geom="c0,c270-c180,c0" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

circle ~45:
node star-stripmine.js -q --blacklist=./blacklist --geom="c90,c0-c180,c270" "~sampel"

square ~14:
node star-stripmine.js -q --blacklist=./blacklist --geom="square,square-square,square" "~sampel"


almost hollow circle missing 7 oclock pretty rare ~4 per star:
node star-stripmine.js --blacklist=./blacklist -q --geom="upleaf,downleaf-*,upleaf" "~sampel"
almost hollow circle missing 4 oclock pretty rare ~4 per star:
node star-stripmine.js --blacklist=./blacklist -q --geom="upleaf,downleaf-downleaf,*" "~sampel"
almost hollow circle missing 10 oclock. more common ~14 per star:
node star-stripmine.js --blacklist=./blacklist -q --geom="*,downleaf-downleaf,upleaf" "~sampel"
almost hollow circle missing 1 oclock. more common ~9 per star:
node star-stripmine.js --blacklist=./blacklist -q --geom="upleaf,*-downleaf,upleaf" "~sampel"

shooting star dexter rampant: only 5
node star-stripmine.js -q --blacklist=./blacklist --geom="*,downleaf-downleaf,downleaf" "~sampel"

shooting star dexter passant: only 5
node star-stripmine.js -q --blacklist=./blacklist --geom="upleaf,upleaf-*,upleaf" "~sampel"

shooting star sinister rampant: only 1
node star-stripmine.js -q --blacklist=./blacklist --geom="upleaf,*-upleaf,upleaf" "~sampel"

shooting star sinister passant: 17
node star-stripmine.js -q --blacklist=./blacklist --geom="downleaf,downleaf-downleaf,*" "~sampel"

diagonal leaf barrier down: ~ 190
node star-stripmine.js -q --blacklist=./blacklist --geom="downleaf,*-*,downleaf" "~sampel" | shuf | head | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

diagonal leaf barrier up: ~115
node star-stripmine.js -q --blacklist=./blacklist --geom="*,upleaf-upleaf,*" "~sampel" | shuf | head | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

node star-stripmine.js --blacklist=./blacklist --name="^~([a-z]).*([a-z]{3})-\1.*\2$" -q "~sampel"
~X..ABC-X..ABC : ~15

shell1: ~10
node star-stripmine.js -q --blacklist=./blacklist --geom="revu,c0-c180,c270" "~sampel" | xargs -P 8 -I{} brave "https://network.urbit.org/{}"

node star-stripmine.js --blacklist=./blacklist --name="^~([a-z]{4}).*-\1.*$" -q "~sampel"
~ABC..X..-ABC..X : ~30

double:
node star-stripmine.js -q --name="^~([a-z]{6})-\1$" "~sampel"

latin: ~100
node star-stripmine.js --blacklist=./blacklist -q --name="(dandus|dantem|dantes|differ|dignus|doctus|fandus|fontem|fontes|former|formes|formet|fortem|fortes|lignum|magnum|magnus|mallet|martyr|matrem|matres|matrum|mittes|montem|montes|morbus|mortem|mortes|nimbus|noctem|noctes|nollet|noster|pardus|partem|partes|partus|passer|patrem|patres|patrum|pictus|pontem|pontes|possem|posset|possum|saltus|signum|sorbus|tactus|tantus|tardus|tarmes)" "~sampel" | sort

*/
'use strict';

const fs = require('fs');


const ob = require('./index.js');
const geo = require('./geo.js');
const help = require('./help.js');

let quiet = false;

function parse_args() {
    const ret = {};
    const [QUIET, HELP, DESC_GEOS, DESC_PHOS, OPTGEOM, OPTNAME, OPTBL]
          = ["-q",
             "--help",
             "--describe-geoms",
             "--describe-phonemes",
             "--geom",
             "--name",
             "--blacklist"];

    // remove "node" and filename
    const argv = process.argv.slice(2);

    if (argv.length === 0) {
        console.log("A star @p needs to be supplied.");
        help.help(1);
    }

    // split into keyvals or maybe just vals
    const args = argv.map(e => e.split("="));

    args.forEach(([k, v]) => {
        switch (k) {
        case HELP: help.help(); break;
        case DESC_GEOS: help.describe_geos(); break;
        case DESC_PHOS: help.describe_phonemes(); break;
        case QUIET: quiet = true; break;
        case OPTGEOM:
            if (!v) {
                console.log("Please specify a geometry.");
                help.help(1);
            }
            const [[geop1, geos1], [geop2, geos2]] = v.split("-").map(e => e.split(","));
            // ensure geometries are valid
            [geop1, geos1, geop2, geos2].forEach(e => {
                if (!e || !geo.geos.has(e) && e !== "*"){
                    console.log(`"${e}" is not a recognized geometry.`);
                    help.help(1);
                }
            });
            Object.assign(ret, {geop1, geos1, geop2, geos2});
            break;
        case OPTNAME:
            if (!v) {
                console.log("Please specify a regex pattern");
                help.help(1);
            }
            // double parens
            // const patt = v.replace("\\", "\\");
            ret.patt = new RegExp(v);
            break;
        case OPTBL:
            if (!v) {
                console.log("Please specify a path to a blacklist");
                help.help(1);
            }
            ret.blacklist = [];
            const contents = fs.readFileSync(v, 'utf8');
            contents.split(/\r?\n/).forEach(line => {
                if (!line) return;
                if (!/^~[a-z]{6}-[a-z]{6}$/.test(line)) {
                    console.log(`While reading ${v}, a malformed planet @p was encountered: ${line}`);
                    process.exit(1);
                }
                ret.blacklist.push(line);
            });
            break;
        default:
            // only non-named arg is the star at the end
            const star = argv.slice(-1)[0];
            if (v || k != star) {
                console.log("A star @p needs to be supplied.");
                help.help(1);
            }
            if (!/^~[a-z]{6}$/.test(star)) {
                console.log("Invalid star @p.");
                help.help(1);
            }
            ret.star = star;
            ret.star_dec = Number(ob.patp2dec(star));
            break;
        }
    });

    // expects non-null, so empty if none specified
    if (!ret.blacklist) ret.blacklist = [];
    ret.blacklist.sort();

    return ret;
}


let {
    star,
    star_dec,
    geop1,                      // geometry first prefix
    geos1,                      // geometry first suffix
    geop2,                      // geometry second prefix
    geos2,                      // geometry second suffix
    patt,
    blacklist,
} = parse_args();

// star geometry means match anything
if (geop1 === "*") geop1 = null;
if (geos1 === "*") geos1 = null;
if (geop2 === "*") geop2 = null;
if (geos2 === "*") geos2 = null;

if (!quiet) {
    console.log(`
Finding matching children for
    star: ${star}
    geom: ${geop1},${geos1}-${geop2},${geos2}
    patt: ${patt}
`);
}

const children =
      Array.from({length: 2**16},
                 (_, i) => star_dec + i * 2**16)
      .slice(1)                 // remove star from children
      .map(e => ob.patp(e))
      .filter(e => !blacklist.includes(e));

const matches =
      children.filter(e => {
          let [[pfix1, sfix1], [pfix2, sfix2]]  = e
              .substring(1)
              .split("-")
              .map(e => [e.substring(0, 3), e.substring(3)]);
          return ((!geop1 || geo.prefix_geo[pfix1] === geop1)
                  && (!geos1 || geo.suffix_geo[sfix1] === geos1)
                  && (!geop2 || geo.prefix_geo[pfix2] === geop2)
                  && (!geos2 || geo.suffix_geo[sfix2] === geos2))
              && (!patt || patt.test(e));
      });

if (quiet) {
    matches.forEach(e => console.log(e));
}
else {
    console.log("matches");
    console.log(matches);
    console.log("argv");
    console.log(process.argv);
}


// .load star-spawn-search.js


// TOOD geom= is still somewhat lacking. I would like the ability to specify
// that prefix A and suffix B share the same geometry, but it can be
// anything. e.g. * can mean anything, but . means anything but . = .
//
// so, geom="downleaf,*-*,downleaf" only pays attention to the downleaf in pref1
// and suff2
//
// but geom="downleaf,.-.,downleaf" will ensure that suff1 and pref2 have the
// same geom, whatever that happens to be.
