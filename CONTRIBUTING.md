# Contributing

This is a quick explanation on how to get started with the project.

## File structure

```tree
 .
├───src    # source code
│       │
│       ├───client    # client exclusive code
│       │
│       ├───interfaces    # typescript types that can be anywhere
│       │
│       ├───lib   # common code for both server and client
│       │
│       ├───routes    # website routes
│       │          │
│       │          └───api    # routes dedicated only to apis
│       │
│       └───server    # code exclusive to server
│
└───static    # static file assets
```

## Path mapping

This project uses path mapping on typescript imports

```
  project paths
  @  =>  src
  @static  =>  static

```
