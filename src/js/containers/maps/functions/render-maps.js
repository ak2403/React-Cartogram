import $ from 'jquery'
import { calculateDistance } from '../../../../default'

const renderMaps = (keys, coordinates, name, data, division, defaultcolor, scale_val, calculation, color_equation, range_props, centroid_name, common_color_props, color_object) => {
    var element = d3.select(`.${name}`).node();
    var width = element.getBoundingClientRect().width;
    var height = 600;
    var padding = 3;

    let max_size = '';
    let min_size = '';
    let min_color = 0;
    let max_color = 0;

    //create a new svg element with the above dimensions
    let map = d3.select(`.${name}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let tooltip = d3.select(".custom-tooltip");

    //create projection
    let b0 = [coordinates['topLong'], coordinates['topLat']]
    let b1 = [coordinates['bottomLong'], coordinates['bottomLat']]

    //create projection
    var projection = d3.geo.mercator()
        .center([(b1[0] + b0[0]) / 2, (b1[1] + b0[1]) / 2])
        .scale(calculateDistance(b0, b1) + (scale_val || 0))
        .translate([width / 2, height / 2])
        .precision(0.1);

    let nodes = []

    for (var i in data) {
        let d = data[i];

        var point = projection([d[keys.longitude], d[keys.latitude]])

        let new_formula = (' ').concat(calculation).slice(1)

        Object.keys(d).map(key => {
            if (new_formula.indexOf(key) !== -1) {
                new_formula = new_formula.replace(new RegExp(`@${key}`, 'g'), d[key])
            }
        })
        // .replace(/[^a-zA-Z0-9. ]/g, "")
        let size_value = eval(new_formula)

        if (!max_size) {
            max_size = size_value
        } else if (max_size < size_value) {
            max_size = size_value
        }

        if (!min_size) {
            min_size = size_value
        } else if (min_size > size_value) {
            min_size = size_value
        }

        let color_eq = (' ').concat(color_equation).slice(1)

        Object.keys(d).map(key => {
            if (color_eq.indexOf(key) !== -1) {
                color_eq = color_eq.replace(new RegExp(`@${key}`, 'g'), d[key])
            }
        })

        let color_value = eval(color_eq.replace(/[^a-zA-Z0-9. ]/g, ""))

        // console.log(range_props)

        // if (range_props.max) {
        //     max_color = range_props.max
        //     data_valid = size_value < range_props.max ? true : false
        // } else {
        if (common_color_props.division) {
            if (max_color < size_value) {
                max_color = size_value
            }
        } else {
            if (max_color < color_value) {
                max_color = color_value
            }
        }
        // }

        // if (range_props.min) {
        //     min_color = range_props.min
        //     if (data_valid) {
        //         data_valid = size_value > range_props.min ? true : false
        //     }
        // } else {
        if (common_color_props.division) {
            if (min_color > size_value) {
                min_color = size_value
            }
        } else {
            if (min_color > color_value) {
                min_color = color_value
            }
        }
        // }

        if (!Number.isNaN(point[0]) && !Number.isNaN(point[1])) {
            nodes.push({
                name: d[centroid_name],
                apply_gray: d.is_centroid_filter,
                grayed: d.grayed,
                x: point[0], y: point[1],
                x0: point[0], y0: point[1],
                value: size_value,
                color: color_value,
                default_color: defaultcolor
            });
        }
    }

    //create svg path generator using the projection
    var path = d3.geo.path()
        .projection(projection);

    var radius = d3.scale.sqrt()
        .domain([range_props.min || min_size, range_props.max || max_size])
        .range([0, 30]);

    var force = d3.layout.force()
        .charge(0)
        .gravity(0)
        .size([width, height]);

    force
        .nodes(nodes)
        .on("tick", tick)
        .start();

    var node = map.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr('class', function (d, i) {
            return `${name}-${i}`
        })
        .attr('size', function (d) {
            return d.value
        })
        .attr("r", function (d) {
            // console.log(radius(d.value))
            return radius(d.value)
            // return 4
        })
        .style("fill", function (d) {
            let colors = d.default_color

            if (common_color_props.division) {
                common_color_props.division.map(list => {
                    let start_val = color_object.max * (Number(list['from']) / 100)
                    let end_val = color_object.max * (Number(list['to']) / 100)
                    if (d.color > start_val && d.color <= end_val) {
                        colors = list.color
                    }
                })
            } else {
                division.map(list => {
                    let start_val = max_color * (Number(list['from']) / 100)
                    let end_val = max_color * (Number(list['to']) / 100)
                    if (d.color > start_val && d.color <= end_val) {
                        colors = list.color
                    }
                })
            }
            return colors
        })
        .style("opacity", function (d) {
            if (d.apply_gray) {
                if (d.grayed)
                    return 1;
                else
                    return 0.3;
            }
            return 1
        })
        .on("mouseover", function (d) {
            tooltip.select("#header").text(`Centroid: ${d.name}`)
            tooltip.select("#description").text(`Size: ${d.value}`)
            // d.color ? tooltip.select("#sub-description").text(`Equation Color: ${d.color}`) : ''
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip.style("top", (d3.event.pageY + 20) + "px").style("left", (d3.event.pageX - 130) + "px");
        })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        })
        .on('click', function (d, i) {
            for (let iter = 0; iter < nodes.length; iter++) {
                if (i !== iter) {
                    $(`.${name}-${iter}`).css('opacity', 0.4)
                } else {
                    $(`.${name}-${iter}`).css('opacity', 1)
                }
            }
        });


    function tick(e) {
        node
            .each(gravity(e.alpha * .1))
            .each(collide(.10))
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) { return d.y; });
    }

    function gravity(k) {
        return function (d) {
            d.x += (d.x0 - d.x) * k;
            d.y += (d.y0 - d.y) * k;
        };
    }

    function collide(k) {
        var q = d3.geom.quadtree(nodes);
        return function (node) {
            // console.log(radius(node.value))
            var nr = radius(node.value) + padding,
                nx1 = node.x - nr,
                nx2 = node.x + nr,
                ny1 = node.y - nr,
                ny2 = node.y + nr;
            q.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = x * x + y * y,
                        r = nr + radius(quad.point.value);
                    if (l < r * r) {
                        l = ((l = Math.sqrt(l)) - r) / l * k;
                        node.x -= x *= l;
                        node.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    return {
        min_color: color_object.min,
        max_color: color_object.max
    }

}

export default renderMaps