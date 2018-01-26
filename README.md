# GMLux (Prototype)
A GameMaker transpiler that supports per-event lightweight objejcts and eventually functions

# Example:
```
object oPlayer = {
   x: 64,
   y: 64
};
```

currently compiles to

```
/*GMLux Object Creation*/ oPlayer = ds_map_create(); oPlayer[? "x"] = 64; oPlayer[? "y"] = 64;
/*GMLux Object Destruction*/ ds_map_destroy(oPlayer);
```
