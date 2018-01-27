# GMLux
A GMLux to GML transpiler that adds support for lightweight objects in the form of ds_maps

# Example:
```
#define main
object oPlayer = {
    x: 32,
    y: 32,
    speed: 8
};

#define step
if (keyboard_check(vk_left) == true) {
    oPlayer.x -= oPlayer.speed;
} else if (keyboard_check(vk_right) == true) {
    oPlayer.x += oPlayer.speed;
}

if (keyboard_check(vk_up) == true) {
    oPlayer.y -= oPlayer.speed;
} else if (keyboard_check(vk_down) == true) {
    oPlayer.y += oPlayer.speed;
}

#define draw
draw_rectangle(oPlayer.x - 8, oPlayer.y - 8, oPlayer.x + 8, oPlayer.y + 8, false);
```

currently compiles to

```
#define main
/*GMLuxCreate*/ oPlayer = ds_map_create(); oPlayer[? "x"] = 32; oPlayer[? "y"] = 32; oPlayer[? "speed"] = 8; 

#define step
if (keyboard_check(vk_left) == true) {
    oPlayer[? "x"] -= oPlayer[? "speed"];
} else if (keyboard_check(vk_right) == true) {
    oPlayer[? "x"] += oPlayer[? "speed"];
}

if (keyboard_check(vk_up) == true) {
    oPlayer[? "y"] -= oPlayer[? "speed"];
} else if (keyboard_check(vk_down) == true) {
    oPlayer[? "y"] += oPlayer[? "speed"];
}

#define draw
draw_rectangle(oPlayer[? "x"] - 8, oPlayer[? "y"] - 8, oPlayer[? "x"] + 8, oPlayer[? "y"] + 8, false);
```
